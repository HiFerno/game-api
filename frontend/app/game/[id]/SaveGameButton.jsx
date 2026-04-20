'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SaveGameButton({ gameId, gameTitle }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    // Recuperamos el token VIP que guardaste en el login
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Debes iniciar sesión para guardar juegos en tu perfil.');
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      // Hacemos el POST a tu backend en Express
      const response = await fetch('http://localhost:3001/api/my-games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Enviamos el JWT para pasar el middleware verifyToken
        },
        body: JSON.stringify({ externalGameId: gameId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al guardar');
      }

      alert(`¡${gameTitle} guardado en tu perfil exitosamente!`);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSave}
      disabled={loading}
      style={{
        padding: '12px 24px',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px',
        width: '100%'
      }}
    >
      {loading ? 'Guardando...' : 'Guardar en mi perfil'}
    </button>
  );
}