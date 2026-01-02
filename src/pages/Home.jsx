import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/racks');
        }
    }, [isAuthenticated, navigate]);

    return (
        <PageContainer>
            <main className="flex flex-col items-center text-center flex-1 px-4 pt-24 md:pt-32">
                <Card className="w-full md:w-5/6 lg:w-4/5">
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">Bem-vindo ao Go Inventory</h1>
                    <p className="text-gray-600 max-w-lg mx-auto mb-6">Um site de inventário logístico, pensado para simplificar o controle de produtos e estoques de forma eficiente e acessível.</p>
                    <img src={process.env.PUBLIC_URL + "/img/banner1.png"} alt="Banner" className="w-full max-w-2xl rounded-xl mb-6 object-contain mx-auto" />
                    <div className="flex justify-center">
                        <a href="#/login">
                            <Button variant="primary">Fazer Login</Button>
                        </a>
                    </div>
                </Card>
            </main>
        </PageContainer>
    );
}
