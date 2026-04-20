'use client'; 
import { useState } from 'react'; //importamos el hook useState para manejar el estado del formulario, los errores y la carga
import { useRouter } from 'next/navigation'; //importamos el hook useRouter para redirigir al usuario después de un registro exitoso


export default function RegisterPage() {
  const router = useRouter(); //instancia del router para redirigir al usuario después de un registro exitoso
  const [formData, setFormData] = useState({ username: '', password: '' }); //estado para manejar los datos del formulario de registro (nombre de usuario y contraseña)
  const [error, setError] = useState(null); //estado para manejar errores de registro
  const [loading, setLoading] = useState(false); //estado para manejar la carga durante el proceso de registro

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); //actualizamos el estado del formulario cada vez que el usuario escribe en los campos de entrada, usando el nombre del campo para actualizar la propiedad correspondiente en formData.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al registrarse');
      }

      // Si todo sale bien, redirigimos al login
      alert('Registro exitoso. ¡Ahora puedes iniciar sesión!');
      router.push('/login'); 
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Crear una Cuenta</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px', backgroundColor: loading ? '#ccc' : '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}