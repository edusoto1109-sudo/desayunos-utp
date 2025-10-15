import React, { useState, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DesayunosUTP() {
  const [estudiantes, setEstudiantes] = useState([
    { id: 1, carrera: 'Ingeniería', género: 'M', hora: '7:00-8:00', desayuno: 'Pancakes', bebida: 'Café', gasto: 15 },
    { id: 2, carrera: 'Administración', género: 'F', hora: '8:00-9:00', desayuno: 'Huevos', bebida: 'Jugo', gasto: 12 },
    { id: 3, carrera: 'Ingeniería', género: 'F', hora: '7:00-8:00', desayuno: 'Tostadas', bebida: 'Café', gasto: 10 },
    { id: 4, carrera: 'Contabilidad', género: 'M', hora: '8:00-9:00', desayuno: 'Yogurt', bebida: 'Leche', gasto: 8 },
    { id: 5, carrera: 'Psicología', género: 'F', hora: '7:00-8:00', desayuno: 'Frutas', bebida: 'Jugo', gasto: 9 },
  ]);

  const [nuevoEstudiante, setNuevoEstudiante] = useState({
    carrera: 'Ingeniería',
    género: 'M',
    hora: '7:00-8:00',
    desayuno: 'Pancakes',
    bebida: 'Café',
    gasto: 15,
  });

  const [activeTab, setActiveTab] = useState('estadisticas');

  const agregarEstudiante = () => {
    setEstudiantes([...estudiantes, { ...nuevoEstudiante, id: Date.now() }]);
    setNuevoEstudiante({ carrera: 'Ingeniería', género: 'M', hora: '7:00-8:00', desayuno: 'Pancakes', bebida: 'Café', gasto: 15 });
  };

  const estadisticas = useMemo(() => {
    const n = estudiantes.length;
    const gastos = estudiantes.map(e => e.gasto);
    const media = (gastos.reduce((a, b) => a + b, 0) / n).toFixed(2);
    const desv = Math.sqrt(gastos.reduce((a, b) => a + (b - media) ** 2, 0) / n).toFixed(2);

    const desayunos = {};
    const bebidas = {};
    const carreras = {};
    const horas = {};

    estudiantes.forEach(e => {
      desayunos[e.desayuno] = (desayunos[e.desayuno] || 0) + 1;
      bebidas[e.bebida] = (bebidas[e.bebida] || 0) + 1;
      carreras[e.carrera] = (carreras[e.carrera] || 0) + 1;
      horas[e.hora] = (horas[e.hora] || 0) + 1;
    });

    return { media, desv, desayunos, bebidas, carreras, horas, n };
  }, [estudiantes]);

  const datosDesayunos = Object.entries(estadisticas.desayunos).map(([name, value]) => ({
    name,
    value,
    probabilidad: (value / estadisticas.n).toFixed(3),
  }));

  const datosBebidas = Object.entries(estadisticas.bebidas).map(([name, value]) => ({
    name,
    value,
    probabilidad: (value / estadisticas.n).toFixed(3),
  }));

  const datosCarreras = Object.entries(estadisticas.carreras).map(([name, value]) => ({
    name,
    value,
  }));

  const datosHoras = Object.entries(estadisticas.horas).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  const probabilidadCondicional = (filtro, valor) => {
    const filtrados = estudiantes.filter(e => e[filtro] === valor);
    if (filtrados.length === 0) return [];
    const desayunos = {};
    filtrados.forEach(e => {
      desayunos[e.desayuno] = (desayunos[e.desayuno] || 0) + 1;
    });
    return Object.entries(desayunos).map(([desayuno, count]) => ({
      desayuno,
      probabilidad: (count / filtrados.length).toFixed(3),
      cantidad: count,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">🥣 Desayunos - Cafetería UTP</h1>
          <p className="text-gray-600">Análisis de Probabilidades en Preferencias de Desayunos y Bebidas</p>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('estadisticas')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${activeTab === 'estadisticas' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
          >
            📊 Estadísticas
          </button>
          <button
            onClick={() => setActiveTab('formulario')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${activeTab === 'formulario' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
          >
            ➕ Nuevo Registro
          </button>
          <button
            onClick={() => setActiveTab('probabilidades')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${activeTab === 'probabilidades' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
          >
            📈 Probabilidades
          </button>
        </div>

        {activeTab === 'estadisticas' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Total de Estudiantes</p>
                <p className="text-3xl font-bold text-blue-600">{estadisticas.n}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Gasto Promedio</p>
                <p className="text-3xl font-bold text-green-600">S/. {estadisticas.media}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Desviación Estándar</p>
                <p className="text-3xl font-bold text-red-600">S/. {estadisticas.desv}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Desayunos Preferidos</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={datosDesayunos} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                      {datosDesayunos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Bebidas Preferidas</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={datosBebidas}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Consumo por Carrera</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={datosCarreras}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Consumo por Hora</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={datosHoras}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'formulario' && (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Registrar Nuevo Estudiante</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Carrera</label>
                <select
                  value={nuevoEstudiante.carrera}
                  onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, carrera: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option>Ingeniería</option>
                  <option>Administración</option>
                  <option>Contabilidad</option>
                  <option>Psicología</option>
                  <option>Otros</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Género</label>
                <select
                  value={nuevoEstudiante.género}
                  onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, género: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option>M</option>
                  <option>F</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hora de Llegada</label>
                <select
                  value={nuevoEstudiante.hora}
                  onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, hora: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option>7:00-8:00</option>
                  <option>8:00-9:00</option>
                  <option>6:00-7:00</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Desayuno</label>
                <select
                  value={nuevoEstudiante.desayuno}
                  onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, desayuno: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option>Pancakes</option>
                  <option>Huevos</option>
                  <option>Tostadas</option>
                  <option>Yogurt</option>
                  <option>Frutas</option>
                  <option>Cereal</option>
                  <option>Pan con queso</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bebida</label>
                <select
                  value={nuevoEstudiante.bebida}
                  onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, bebida: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option>Café</option>
                  <option>Jugo</option>
                  <option>Leche</option>
                  <option>Té</option>
                  <option>Chocolate</option>
                  <option>Agua</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gasto (S/.)</label>
                <input
                  type="number"
                  value={nuevoEstudiante.gasto}
                  onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, gasto: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
            <button
              onClick={agregarEstudiante}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              ➕ Agregar Registro
            </button>
          </div>
        )}

        {activeTab === 'probabilidades' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Probabilidades por Hora: 7:00-8:00</h3>
                <div className="space-y-2">
                  {probabilidadCondicional('hora', '7:00-8:00').length > 0 ? (
                    probabilidadCondicional('hora', '7:00-8:00').map((item, idx) => (
                      <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>{item.desayuno}</span>
                        <span className="font-semibold text-blue-600">{item.probabilidad}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Sin datos</p>
                  )}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Probabilidades por Carrera: Ingeniería</h3>
                <div className="space-y-2">
                  {probabilidadCondicional('carrera', 'Ingeniería').length > 0 ? (
                    probabilidadCondicional('carrera', 'Ingeniería').map((item, idx) => (
                      <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>{item.desayuno}</span>
                        <span className="font-semibold text-blue-600">{item.probabilidad}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Sin datos</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Tabla de Probabilidades Simples</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-gray-700 mb-3">Desayunos</p>
                  {datosDesayunos.map((item, idx) => (
                    <p key={idx} className="text-sm text-gray-600 mb-1">P({item.name}) = {item.probabilidad}</p>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-3">Bebidas</p>
                  {datosBebidas.map((item, idx) => (
                    <p key={idx} className="text-sm text-gray-600 mb-1">P({item.name}) = {item.probabilidad}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
