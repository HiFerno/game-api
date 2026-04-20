import Link from 'next/link'; //componente Link de Next.js para crear enlaces de navegación entre páginas

export default async function HomePage() {
  const res = await fetch('https://www.freetogame.com/api/games', {
    next: { revalidate: 3600 } 
  });

  if (!res.ok) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Ups, hubo un problema al cargar los juegos.</h2>
      </div>
    );
  }

  const games = await res.json();

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #eaeaea' }}>
        <h1 style={{ margin: 0 }}>Free2Play Hub</h1>
        <div>
          <Link href="/my-games" style={{ marginRight: '15px', textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>
            Mis Juegos
          </Link>
          <Link href="/login" style={{ textDecoration: 'none', color: '#666' }}>
            Cambiar Cuenta
          </Link>
        </div>
      </nav>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {games.map((game) => (
          <Link 
            href={`/game/${game.id}`} 
            key={game.id}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{
              border: '1px solid #eaeaea',
              borderRadius: '10px',
              overflow: 'hidden',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <img 
                src={game.thumbnail} 
                alt={game.title} 
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
              <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{game.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', fontWeight: 'bold' }}>
                  <span style={{ backgroundColor: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>{game.genre}</span>
                  <span>{game.platform === 'PC (Windows)' ? 'PC' : 'Web'}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}