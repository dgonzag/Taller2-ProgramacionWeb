import express from 'express';

const app = express();
app.use(express.json());
//Ejercicio 1

app.get('/api/calculo/:monto', (req, res) => {
    const monto = Number(req.params.monto);

    if (!Number.isFinite(monto) || monto <= 0) {
        return res.status(400).json({
            error: 'El salario debe ser un numero mayor a cero',
        });
    }

    res.json({
        monto,
        iva: monto * 0.13,
        renta: monto * 0.1,
    });
});

//Ejercicio 2

const impuestosPorPais = {
  'el salvador': { nombre: 'elsalvador', iva: 13, renta: 10 },
	'guatemala': { nombre: 'guatemala', iva: 12, renta: 10 },
	'costa rica': { nombre: 'costarica', iva: 13, renta: 10 },
	'honduras': { nombre: 'honduras', iva: 15, renta: 10 },
	'panama': { nombre: 'panama', iva: 7, renta: 10 },
	'nicaragua': { nombre: 'nicaragua', iva: 15, renta: 10 },
};

function normalizarPais(pais) {
  return pais.trim().toLowerCase().replace(/\s+/g, ' ');
}

function calcularImpuestos(pais, salario) {
	const configuracion = impuestosPorPais[normalizarPais(pais)];

	if (!configuracion) {
		throw new Error(
			'Pais no permitido. Use: El Salvador, Guatemala, Costa Rica, Honduras, Panama o Nicaragua',
		);
	}

	const salarioBruto = Number(salario);

	if (!Number.isFinite(salarioBruto) || salarioBruto <= 0) {
		throw new Error('El salario debe ser un numero mayor a cero');
	}

	const iva = salarioBruto * (configuracion.iva / 100);
	const renta = salarioBruto * (configuracion.renta / 100);

	return {
		pais: configuracion.nombre,
		salarioBruto,
		porcentajeIVA: `${configuracion.iva}%`,
		porcentajeRenta: `${configuracion.renta}%`,
		iva,
		renta,
		salarioNeto: salarioBruto - iva - renta,
	};
}

app.get('/api/impuestos/:pais/:salario', (req, res) => {
	try {
		return res.json(calcularImpuestos(req.params.pais, req.params.salario));
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`API de impuestos iniciada en http://localhost:${port}`);
});