const express = require('express');
const cors = require('cors');
const Presupuesto = require('./models/Presupuesto');
const Comida = require('./models/Comida');
const TipoDeComida = require('./models/TipoDeComida');
const Comida_TipoDeComida = require('./models/Comida_TipoDeComida');
const Restaurante = require('./models/Restaurante');
const Restaurante_TipoDeComida = require('./models/Restaurante_TipoDeComida');
const port = parseInt(process.env.PORT) || process.argv[3] || 8080;
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World');
});

TipoDeComida.belongsToMany(Comida, {
  through: Comida_TipoDeComida,
  foreignKey: 'id_tipo_comida'
});

Comida.belongsToMany(TipoDeComida, {
  through: Comida_TipoDeComida,
  foreignKey: 'id_comida'
});

TipoDeComida.belongsToMany(Restaurante, {
  through: Restaurante_TipoDeComida,
  foreignKey: 'id_tipo_comida'
});

Restaurante.belongsToMany(TipoDeComida, {
  through: Restaurante_TipoDeComida,
  foreignKey: 'id_restaurante'
});

app.post('/comida', async (req, res) => {
  const { nombre_comida } = req.body;

  if (!nombre_comida) {
    return res.status(400).json({ error: 'El nombre de la comida es requerido' });
  }

  try {
    const comida = await Comida.findOne({
      where: { nombre_comida }
    });

    if (!comida) {
      return res.status(404).json({ error: 'No se encontró una comida con ese nombre' });
    }

    res.status(200).json({
      id_comida: comida.id_comida,
      nombre_comida: comida.nombre_comida
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar la comida' });
  }
});

app.post('/presupuesto', async (req, res) => {
  const { nivelPresupuesto } = req.body;

  try {
    if (nivelPresupuesto) {
      const presupuesto = await Presupuesto.findOne({
        where: { nivel_presupuesto: nivelPresupuesto }
      });

      if (!presupuesto) {
        return res.status(404).json({ error: 'No se encontró un presupuesto con ese nivel' });
      }

      return res.status(200).json({
        id_presupuesto: presupuesto.id_presupuesto,
        nivel_presupuesto: presupuesto.nivel_presupuesto
      });
    } else {
      const presupuestos = await Presupuesto.findAll();
      const presupuestoAleatorio = presupuestos[Math.floor(Math.random() * presupuestos.length)];

      return res.status(200).json({
        id_presupuesto: presupuestoAleatorio.id_presupuesto,
        nivel_presupuesto: presupuestoAleatorio.nivel_presupuesto
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el presupuesto' });
  }
});

app.post('/tipo-comida', async (req, res) => {
  const { id_comida } = req.body;

  if (!id_comida) {
    return res.status(400).json({ error: 'El id_comida es requerido' });
  }

  try {
    const comidasTipoComida = await Comida_TipoDeComida.findAll({
      where: { id_comida }  // Buscamos por id_comida
    });

    if (comidasTipoComida.length === 0) {
      return res.status(404).json({ error: 'No se encontraron tipos de comida para este id_comida' });
    }

    const comidaTipoAleatorio = comidasTipoComida[Math.floor(Math.random() * comidasTipoComida.length)];

    const tipoComida = await TipoDeComida.findByPk(comidaTipoAleatorio.id_tipo_comida);

    if (!tipoComida) {
      return res.status(404).json({ error: 'No se encontró el tipo de comida' });
    }

    res.status(200).json({ tipoComida: tipoComida.nombre_tipo_comida, idTipoComida: tipoComida.id_tipo_comida });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el tipo de comida' });
  }
});

app.post('/restaurante', async (req, res) => {
  const { id_tipo_comida, id_presupuesto } = req.body;

  try {
    // Paso 1: Buscar los restaurantes que cumplen con el id_presupuesto
    const restaurantesConPresupuesto = await Restaurante.findAll({
      where: { id_presupuesto },
      attributes: ['id_restaurante', 'nombre_restaurante'] // Solo necesitamos estos atributos
    });

    if (restaurantesConPresupuesto.length === 0) {
      return res.status(404).json({ message: 'No se encontraron restaurantes que cumplan con el presupuesto.' });
    }

    // Paso 2: Buscar los id_restaurante que estén asociados con el id_tipo_comida en la tabla intermedia
    const restauranteTipoComida = await Restaurante_TipoDeComida.findAll({
      where: { id_tipo_comida },
      attributes: ['id_restaurante'] // Solo necesitamos el id_restaurante
    });

    if (restauranteTipoComida.length === 0) {
      return res.status(404).json({ message: 'No se encontraron restaurantes asociados a este tipo de comida.' });
    }

    // Paso 3: Filtrar los restaurantes que coinciden en ambas consultas
    const idsRestaurantesTipoComida = restauranteTipoComida.map(rt => rt.id_restaurante);
    const restaurantesCoincidentes = restaurantesConPresupuesto.filter(restaurante =>
      idsRestaurantesTipoComida.includes(restaurante.id_restaurante)
    );

    if (restaurantesCoincidentes.length === 0) {
      return res.status(404).json({ message: 'No se encontraron restaurantes que cumplan con los criterios de tipo de comida y presupuesto.' });
    }

    // Seleccionar aleatoriamente uno de los restaurantes coincidentes
    const restauranteAleatorio = restaurantesCoincidentes[Math.floor(Math.random() * restaurantesCoincidentes.length)];

    // Devolver el nombre del restaurante seleccionado
    res.status(200).json({ restaurante: restauranteAleatorio.nombre_restaurante });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el restaurante' });
  }
});

app.listen(port, () => {
  console.log('Servidor escuchando en el puerto', port);
});
