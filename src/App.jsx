import { useState } from 'react';
import './App.css';
import establecimientos from './data/establecimientos';

function App() {
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('');
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const provincias = [
    ...new Set(establecimientos.map((tienda) => tienda.provincia)),
  ].sort((a, b) => a.localeCompare(b, 'es'));

  // Obtener las ciudades de la provincia seleccionada
  const ciudades = [
    ...new Set(
      establecimientos
        .filter((tienda) => tienda.provincia === provinciaSeleccionada)
        .map((tienda) => tienda.ciudad)
    ),
  ].sort((a, b) => a.localeCompare(b, 'es'));

  // Filtrar establecimientos por provincia, ciudad y búsqueda
  const tiendasFiltradas = establecimientos
    .filter((tienda) => {
      const texto = busqueda.toLowerCase();

      const coincideProvincia =
        tienda.provincia === provinciaSeleccionada;

      const coincideCiudad =
        !ciudadSeleccionada || tienda.ciudad === ciudadSeleccionada;

      const coincideBusqueda =
        tienda.nombre.toLowerCase().includes(texto) ||
        tienda.ciudad.toLowerCase().includes(texto) ||
        tienda.provincia.toLowerCase().includes(texto) ||
        (tienda.direccion || '').toLowerCase().includes(texto);

      return coincideProvincia && coincideCiudad && coincideBusqueda;
    })
    .sort((a, b) => {
      const comparacionCiudad = a.ciudad.localeCompare(b.ciudad, 'es');

      if (comparacionCiudad !== 0) {
        return comparacionCiudad;
      }

      return a.nombre.localeCompare(b.nombre, 'es');
    });

  // Agrupar establecimientos por ciudad
  const tiendasPorCiudad = tiendasFiltradas.reduce((grupos, tienda) => {
    if (!grupos[tienda.ciudad]) {
      grupos[tienda.ciudad] = [];
    }

    grupos[tienda.ciudad].push(tienda);

    return grupos;
  }, {});

  return (
    <div className="pagina">
      <header className="encabezado">
        <p className="marca">DIRECTORIO PROFESIONAL</p>

        <h1>Empresas Cataluña</h1>

        <p className="subtitulo">
          Encuentra tiendas de iluminación y decoración.
        </p>
      </header>

      <main className="contenido">
        <section className="selector-ciudad">
          <p className="etiqueta">EXPLORA EL DIRECTORIO</p>

          <h2>¿Qué provincia quieres visitar?</h2>

          <p className="descripcion">
            Selecciona una provincia para consultar sus establecimientos,
            organizados por ciudad.
          </p>

          {/* Desplegable de provincias */}
          <select
            value={provinciaSeleccionada}
            onChange={(evento) => {
              setProvinciaSeleccionada(evento.target.value);
              setCiudadSeleccionada('');
              setBusqueda('');
            }}
            aria-label="Selecciona una provincia"
          >
            <option value="">Selecciona una provincia</option>

            {provincias.map((provincia) => (
              <option key={provincia} value={provincia}>
                {provincia}
              </option>
            ))}
          </select>

          {/* Desplegable opcional de ciudades */}
          {provinciaSeleccionada && (
            <div className="selector-ciudad-extra">
              <label htmlFor="seleccion-ciudad">
                ¿Quieres elegir una ciudad? (Opcional)
              </label>

              <select
                id="seleccion-ciudad"
                value={ciudadSeleccionada}
                onChange={(evento) => {
                  setCiudadSeleccionada(evento.target.value);
                  setBusqueda('');
                }}
                aria-label="Filtrar por ciudad"
              >
                <option value="">Todas las ciudades</option>

                {ciudades.map((ciudad) => (
                  <option key={ciudad} value={ciudad}>
                    {ciudad}
                  </option>
                ))}
              </select>
            </div>
          )}
        </section>

        {provinciaSeleccionada && (
          <section className="resultados">
            <div className="titulo-resultados">
              <div>
                <p className="etiqueta">
                  {ciudadSeleccionada
                    ? 'CIUDAD DE'
                    : 'PROVINCIA DE'}
                </p>

                <h2>
                  {ciudadSeleccionada || provinciaSeleccionada}
                </h2>

                <p className="contador">
                  {tiendasFiltradas.length}{' '}
                  {tiendasFiltradas.length === 1
                    ? 'establecimiento'
                    : 'establecimientos'}
                </p>
              </div>

              <button
                className="boton-volver"
                onClick={() => {
                  setProvinciaSeleccionada('');
                  setCiudadSeleccionada('');
                  setBusqueda('');
                }}
              >
                ← Volver al inicio
              </button>
            </div>

            <input
              className="buscador"
              type="text"
              placeholder="Buscar tienda, ciudad o dirección..."
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />

            {Object.keys(tiendasPorCiudad).length > 0 ? (
              <div className="ciudades">
                {Object.entries(tiendasPorCiudad).map(
                  ([ciudad, tiendas]) => (
                    <section className="grupo-ciudad" key={ciudad}>
                      <h2 className="titulo-ciudad">{ciudad}</h2>

                      <div className="lista-tiendas">
                        {tiendas.map((tienda) => (
                          <article
                            className="tarjeta-tienda"
                            key={tienda.id}
                          >
                            <h3>{tienda.nombre}</h3>

                            <p className="ubicacion">
                              {tienda.ciudad} · {tienda.provincia}
                            </p>

                            {tienda.direccion ? (
                              <>
                                <p className="direccion">
                                  {tienda.direccion}
                                </p>

                                <a
                                  className="enlace"
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    `${tienda.nombre}, ${tienda.direccion}, ${tienda.ciudad}`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Ver en Google Maps ↗
                                </a>
                              </>
                            ) : (
                              <p className="direccion-pendiente">
                                Dirección pendiente de añadir
                              </p>
                            )}

                            {tienda.web && (
                              <a
                                className="enlace enlace-web"
                                href={tienda.web}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Visitar página web ↗
                              </a>
                            )}
                          </article>
                        ))}
                      </div>
                    </section>
                  )
                )}
              </div>
            ) : (
              <p className="sin-resultados">
                No se han encontrado establecimientos.
              </p>
            )}
          </section>
        )}
      </main>

      <footer className="pie">
        Directorio de iluminación y decoración · Cataluña
      </footer>
    </div>
  );
}

export default App;