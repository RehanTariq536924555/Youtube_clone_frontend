import React, { useState } from 'react';
import { AuthLayout } from './auth/AuthLayout';
import { Login } from './auth/Login';
import { CreateChannel } from './auth/CreateChannel';

export type AuthStep = 'login' | 'create-channel';

export const Auth: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<AuthStep>('login');

    const getStepInfo = () => {
        switch (currentStep) {
            case 'login':
                return { title: 'Welcome to NebulaStream', subtitle: 'Sign in with Google to get started' };
            case 'create-channel':
                return { title: 'How you\'ll appear', subtitle: 'Create your channel to start uploading' };
            default:
                return { title: 'Welcome to NebulaStream', subtitle: 'Sign in with Google to get started' };
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 'login':
                return <Login />;
            case 'create-channel':
                return <CreateChannel onChannelCreated={() => {
                    // Channel creation completed - user will be automatically logged in
                    // The auth context will handle the navigation
                }} />;
            default:
                return <Login />;
        }
    };

    const { title, subtitle } = getStepInfo();

    return (
        <AuthLayout title={title} subtitle={subtitle}>
            {renderStep()}
        </AuthLayout>
    );
};