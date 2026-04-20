import Link from 'next/link';
import SaveGameButton from './SaveGameButton'; // Crearemos esto en el siguiente paso

// 1. COMPONENTE DE SERVIDOR: Obtiene los detalles del juego de la API externa
export default async function GameDetailPage({ params }) {
  // Aquí está el cambio: agregamos 'await' porque params ahora es una Promesa
  const { id } = await params;

  const res = await fetch(`https://www.freetogame.com/api/game?id=${id}`, {
    cache: 'no-store' // Queremos la info más fresca
  });

  if (!res.ok) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Juego no encontrado</div>;
  }

  const game = await res.json();

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      
      <Link href="/" style={{ textDecoration: 'none', color: '#0070f3', marginBottom: '20px', display: 'inline-block' }}>
        &larr; Volver a la lista
      </Link>

      <div style={{ display: 'flex', gap: '30px', marginTop: '20px', flexWrap: 'wrap' }}>
        <img 
          src={game.thumbnail} 
          alt={game.title} 
          style={{ width: '100%', maxWidth: '350px', borderRadius: '10px', objectFit: 'cover' }}
        />
        
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: '0 0 10px 0' }}>{game.title}</h1>
          <p style={{ color: '#666', fontWeight: 'bold' }}>{game.developer} • {game.publisher}</p>
          
          <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <p><strong>Género:</strong> {game.genre}</p>
            <p><strong>Plataforma:</strong> {game.platform}</p>
            <p><strong>Fecha de lanzamiento:</strong> {game.release_date}</p>
          </div>

          {/* 2. COMPONENTE DE CLIENTE: Maneja la lógica de guardar en tu BD */}
          <SaveGameButton gameId={game.id} gameTitle={game.title} />
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Acerca del juego</h3>
        {/* dangerouslySetInnerHTML se usa porque la API a veces devuelve etiquetas HTML en la descripción */}
        <p dangerouslySetInnerHTML={{ __html: game.description }} style={{ lineHeight: '1.6' }}></p>
      </div>
    </main>
  );
}