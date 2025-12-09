import { useState } from "react";

export default function VariacionPorLocal({ volverLoginSupervisora }) {
    const [localA, setLocalA] = useState(1);
    const [localB, setLocalB] = useState(2);
    const [inicio, setInicio] = useState("");
    const [fin, setFin] = useState("");
    const [datos, setDatos] = useState([]);
    const [desbalances, setDesbalances] = useState([]);
    const [recomendaciones, setRecomendaciones] = useState([]);
    const backend = "http://localhost:4000";

    const comparar = async () => {
    const q = new URLSearchParams({
        locales: `${localA},${localB}`,
        ...(inicio ? { inicio } : {}),
        ...(fin ? { fin } : {})
    }).toString();
    const res = await fetch(`${backend}/variacion/comparar?${q}`);
    const json = await res.json();
    setDatos(json);
    };

    const verDesbalances = async () => {
    const q = new URLSearchParams({ locales: `${localA},${localB}` }).toString();
    const res = await fetch(`${backend}/variacion/desbalances?${q}&threshold=20`);
    const json = await res.json();
    setDesbalances(json);
    };

    const verRecomendaciones = async () => {
    const q = new URLSearchParams({ locales: `${localA},${localB}` }).toString();
    const res = await fetch(`${backend}/variacion/redistribucion?${q}`);
    const json = await res.json();
    setRecomendaciones(json);
    };

    return (
    <div style={{ padding: 16 }}>
        <h1>Variación de productos por local</h1>

        <div>
        <label>Local A: </label>
        <select value={localA} onChange={e => setLocalA(Number(e.target.value))}>
            <option value={1}>Local 1</option>
            <option value={2}>Local 2</option>
            <option value={3}>Bodega</option>
        </select>

        <label style={{ marginLeft: 12 }}>Local B: </label>
        <select value={localB} onChange={e => setLocalB(Number(e.target.value))}>
            <option value={1}>Local 1</option>
            <option value={2}>Local 2</option>
            <option value={3}>Bodega</option>
        </select>
        </div>

        <div style={{ marginTop: 12 }}>
        <label>Inicio: </label>
        <input type="date" value={inicio} onChange={e => setInicio(e.target.value)} />
        <label style={{ marginLeft: 8 }}>Fin: </label>
        <input type="date" value={fin} onChange={e => setFin(e.target.value)} />
        </div>

        <div style={{ marginTop: 12 }}>
        <button onClick={comparar}>Comparar inventarios</button>
        <button style={{ marginLeft: 8 }} onClick={verDesbalances}>Ver desbalances</button>
        <button style={{ marginLeft: 8 }} onClick={verRecomendaciones}>Ver recomendaciones</button>
        </div>

        <hr />

        {datos.length > 0 && (
        <>
            <h2>Comparación</h2>
            <table border="1" style={{ margin: "0 auto" }}>
            <thead>
                <tr>
                <th>Producto</th>
                <th>Stock A</th>
                <th>Stock B</th>
                <th>Consumo A</th>
                <th>Consumo B</th>
                <th>Diferencia</th>
                <th>%</th>
                <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                {datos.map((d, i) => (
                <tr key={i} style={{ background: d.estado === "rojo" ? "#ffd6d6" : d.estado === "amarillo" ? "#fff4ce" : "transparent" }}>
                    <td>{d.producto}</td>
                    <td>{d[`stock_local_${localA}`] ?? 0}</td>
                    <td>{d[`stock_local_${localB}`] ?? 0}</td>
                    <td>{d[`consumo_local_${localA}`] ?? 0}</td>
                    <td>{d[`consumo_local_${localB}`] ?? 0}</td>
                    <td>{d.diferencia ?? 0}</td>
                    <td>{d.diferenciaPct ?? 0}%</td>
                    <td>{d.estado}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </>
        )}

        {desbalances.length > 0 && (
        <>
            <h3>Desbalances detectados</h3>
            <ul>
            {desbalances.map((d, i) => (
                <li key={i} style={{ color: d.estado === "rojo" ? "red" : "orange" }}>
                {d.producto} — {d.diferencia} unidades — {d.diferenciaPct}% — {d.estado}
                </li>
            ))}
            </ul>
        </>
        )}

        {recomendaciones.length > 0 && (
        <>
            <h3>Recomendaciones</h3>
            <ul>
            {recomendaciones.map((r, i) => (
                <li key={i}>
                Mover <b>{r.cantidad}</b> de <b>{r.producto}</b> desde Local {r.desde} → Local {r.hacia} ({r.razon})
                </li>
            ))}
            </ul>
        </>
        )}

        <br />
        <button onClick={volverLoginSupervisora}>Volver</button>
    </div>
    );
}
