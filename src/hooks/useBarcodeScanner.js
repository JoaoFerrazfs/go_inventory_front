import { useState, useRef, useEffect, useMemo } from 'react';
import Quagga from 'quagga';
import toast from 'react-hot-toast';

const useBarcodeScanner = (options = {}) => {
    const [scanning, setScanning] = useState(false);
    const [detectedCode, setDetectedCode] = useState(null);
    const videoRef = useRef(null);

    const defaultOptions = useMemo(() => ({
        width: 1280,
        height: 720,
        facingMode: 'environment',
        patchSize: 'medium',
        halfSample: true,
        numOfWorkers: 4,
        readers: ['ean_reader', 'code_128_reader', 'upc_reader', 'code_39_reader', 'codabar_reader', 'i2of5_reader'],
        locate: true,
        ...options
    }), [options]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (scanning) {
            Quagga.init({
                inputStream: {
                    name: 'Live',
                    type: 'LiveStream',
                    target: videoRef.current,
                    constraints: {
                        width: defaultOptions.width,
                        height: defaultOptions.height,
                        facingMode: defaultOptions.facingMode
                    },
                },
                locator: {
                    patchSize: defaultOptions.patchSize,
                    halfSample: defaultOptions.halfSample
                },
                numOfWorkers: defaultOptions.numOfWorkers,
                decoder: {
                    readers: defaultOptions.readers
                },
                locate: defaultOptions.locate
            }, (err) => {
                if (err) {
                    let message = 'Erro ao inicializar scanner.';
                    if (err.name === 'NotAllowedError') {
                        message = 'Permissão de câmera negada. Permita o acesso à câmera e tente novamente.';
                    } else if (err.name === 'NotFoundError') {
                        message = 'Nenhuma câmera encontrada.';
                    }
                    toast.error(message);
                    setScanning(false);
                    return;
                }
                Quagga.start();
            });

            Quagga.onDetected((result) => {
                setDetectedCode(result.codeResult.code);
                stopScanning();
            });
        } else {
            try {
                Quagga.stop();
                Quagga.offDetected();
            } catch (err) {
                console.error('Erro ao parar scanner:', err);
            }
        }

        return () => {
            try {
                Quagga.stop();
                Quagga.offDetected();
            } catch (err) {
                console.error('Erro ao limpar scanner:', err);
            }
        };
    }, [scanning, defaultOptions]);

    const startScanning = () => {
        setDetectedCode(null);
        setScanning(true);
    };

    const stopScanning = () => {
        setScanning(false);
    };

    return {
        scanning,
        detectedCode,
        startScanning,
        stopScanning,
        videoRef
    };
};

export default useBarcodeScanner;