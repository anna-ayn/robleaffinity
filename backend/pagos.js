import { getClient } from './client.js';
import jwt from 'jsonwebtoken';

export async function insertUserTarjeta(req, res) {
  const client = getClient();

  try {
    const { card_number, titular, due_date, cvv, type_card  } = req.body;


    const token = req.headers.authorization.split(" ")[1];
    const dataDecoded = jwt.decode(token);
    const userId = dataDecoded.id_cuenta
    const query = `
    SELECT insert_user_tarjeta($1, $2, $3, $4, $5, $6)
  `;
    const values = [userId, card_number, titular, due_date, cvv, type_card];    

    await client.query(query, values);
    res.status(200).json({ message: 'Tarjeta insertada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

export async function deleteInstanceRegistra(req, res) {
    const client = getClient();
  
    try {
      const { card_number } = req.body;
  
      const token = req.headers.authorization.split(" ")[1];
      const dataDecoded = jwt.decode(token);
      const userId = dataDecoded.id_cuenta;
  
      const query = `
        SELECT delete_instance_registra($1, $2)
      `;
      const values = [userId, card_number];
  
      await client.query(query, values);
      res.status(200).json({ message: 'Registro eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    } finally {
      await client.end();
    }
  }
  
export async function updateDueDateCard(req, res) {
    const client = getClient();
  
    try {
      const { card_number, new_due_date } = req.body;
  
      const query = `
        SELECT update_due_date_card($1, $2)
      `;
      const values = [card_number, new_due_date];
  
      await client.query(query, values);
      res.status(200).json({ message: 'Fecha de caducidad actualizada correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    } finally {
      await client.end();
    }
}
  
export async function getDataPago(req, res) {
    const client = getClient();
  
    try {
      const { id_pago } = req.params;
  
      const query = `
        SELECT * FROM get_data_pago($1)
      `;
      const values = [id_pago];
  
      const result = await client.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Pago no encontrado' });
      }
  
      const data = result.rows[0];
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    } finally {
      await client.end();
    }
  }

export async function subscribeUserToTier(req, res) {
  const client = getClient();

  try {
    // Obtener los datos del cuerpo de la solicitud
    const {
      nombre_tier_usuario,
      plazo_tier,
      digitos_tarjeta_usario,
      numero_factura_actual,
      estado_pago,
      monto_pago,
      documento_factura_usuario
    } = req.body;

    // Obtener el token de autorización del encabezado
    const token = req.headers.authorization.split(" ")[1];
    const dataDecoded = jwt.decode(token);
    const id_cuenta_usuario = dataDecoded.id_cuenta;

    // Consultar la base de datos usando la función subscribe_user
    const query = `
      SELECT subscribe_user($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const values = [
      id_cuenta_usuario,
      nombre_tier_usuario,
      plazo_tier,
      digitos_tarjeta_usario,
      numero_factura_actual,
      estado_pago,
      monto_pago,
      documento_factura_usuario
    ];

    await client.query(query, values);

    // Responder al cliente que la suscripción fue exitosa
    res.status(200).json({ message: 'Suscripción del usuario realizada correctamente' });
  } catch (error) {
    console.error('Error en subscribeUser:', error);

    // Enviar una respuesta de error en caso de excepción
    res.status(500).json({ message: error.message });
  } finally {
    // Asegurarse de cerrar la conexión con la base de datos
    await client.end();
  }
}

