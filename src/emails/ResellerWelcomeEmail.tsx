import * as React from 'react';

interface ResellerWelcomeEmailProps {
  resellerName: string;
  email: string;
  password: string;
  loginUrl: string;
}

export const ResellerWelcomeEmail = ({
  resellerName,
  email,
  password,
  loginUrl,
}: ResellerWelcomeEmailProps) => {
  return (
    <div style={{
      fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      backgroundColor: '#ffffff',
      padding: '20px',
      color: '#484848'
    }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
          Bienvenue, {resellerName}
        </h1>
        
        <p style={{ fontSize: '16px', lineHeight: '26px', marginBottom: '20px' }}>
          Votre compte revendeur D3D a été créé avec succès. Voici vos identifiants pour accéder à votre espace de commande :
        </p>

        <div style={{
          padding: '24px',
          backgroundColor: '#f2f3f3',
          borderRadius: '4px',
          margin: '24px 0',
          fontSize: '16px'
        }}>
          <p style={{ margin: '0 0 10px' }}>
            <strong>Email :</strong> {email}
          </p>
          <p style={{ margin: '0' }}>
            <strong>Mot de passe temporaire :</strong> {password}
          </p>
        </div>

        <a 
          href={loginUrl}
          style={{
            backgroundColor: '#000000',
            borderRadius: '5px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            textDecoration: 'none',
            textAlign: 'center',
            display: 'block',
            width: '100%',
            padding: '12px',
            marginTop: '20px',
            marginBottom: '20px'
          }}
        >
          Se connecter au Dashboard
        </a>

        <p style={{ fontSize: '16px', lineHeight: '26px', marginBottom: '20px' }}>
          Pour des raisons de sécurité, nous vous conseillons de ne pas partager ces accès.
        </p>
        
        <p style={{ color: '#8898aa', fontSize: '12px', marginTop: '24px' }}>
          L'équipe D3D
        </p>
      </div>
    </div>
  );
};

export default ResellerWelcomeEmail;
