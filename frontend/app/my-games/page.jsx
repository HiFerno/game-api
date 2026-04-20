'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MyGamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSavedGames = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/api/my-games', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Error al obtener tus juegos');
        
        const gamesData = await response.json(); 
        setGames(gamesData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedGames();
  }, [router]);

  const handleDelete = async (gameId, gameTitle) => {
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar ${gameTitle} de tu perfil?`);
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:3001/api/my-games/${gameId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('No se pudo eliminar el juego');

    
      setGames(games.filter(game => game.id !== gameId));
      
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando tu colección...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>{error}</div>;

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #eaeaea' }}>
        <h1 style={{ margin: 0 }}>Mi Colección</h1>
        <div>
          <Link href="/" style={{ marginRight: '15px', textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>
            Explorar Juegos
          </Link>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold' }}>
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {games.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
          <h2>Aún no tienes juegos guardados.</h2>
          <Link href="/" style={{ textDecoration: 'none', color: '#0070f3' }}>Vuelve al inicio para explorar</Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {games.map((game) => (
            <div key={game.id} style={{
              border: '1px solid #eaeaea',
              borderRadius: '10px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Link href={`/game/${game.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img 
                  src={game.thumbnail} 
                  alt={game.title} 
                  style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                />
              </Link>
              <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{game.title}</h3>
                
                <button 
                  onClick={() => handleDelete(game.id, game.title)}
                  style={{
                    marginTop: '15px',
                    padding: '8px',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    border: '1px solid #f87171',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    width: '100%'
                  }}
                >
                  Eliminar de mi perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}