import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Meta from '../../componentes/Meta';
import { Campo } from '../../componentes/Campo';
import { ingresar, useAdmin } from '../../lib/useAdmin';

export default function Login() {
  const { esAdmin, cargando } = useAdmin();
  const navegar = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!cargando && esAdmin) return <Navigate to="/admin" replace />;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      await ingresar(email, pass);
      navegar('/admin', { replace: true });
    } catch (err) {
      const code = (err as { code?: string }).code ?? '';
      setError(
        code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')
          ? 'Email o contraseña incorrectos.'
          : err instanceof Error ? err.message : 'No pudimos ingresar.',
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex-1 grid place-items-center px-5 py-16">
      <Meta titulo="Ingresar al panel — Pelado Automotores" descripcion="Acceso restringido." />
      <form onSubmit={enviar} className="w-full max-w-[380px] border border-borde bg-negro-2 p-8 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-verde">
            Panel de administración
          </span>
          <h1 className="titulo text-[34px] m-0">Ingresar</h1>
        </div>
        <Campo label="Email">
          <input
            className="input"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="dueño@peladoautomotores.com"
          />
        </Campo>
        <Campo label="Contraseña">
          <input
            className="input"
            type="password"
            required
            autoComplete="current-password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••••"
          />
        </Campo>
        {error && <p className="m-0 text-sm text-reservado">{error}</p>}
        <button
          type="submit"
          disabled={enviando}
          className="btn-verde border-0 cursor-pointer justify-center disabled:opacity-45"
        >
          {enviando ? 'Ingresando…' : 'Entrar'}
        </button>
        <span className="text-xs text-txt-5 leading-relaxed">
          Acceso restringido a los emails autorizados de Pelado Automotores.
        </span>
      </form>
    </div>
  );
}
