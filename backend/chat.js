import { getClient } from "./client.js";
import jwt from "jsonwebtoken";

export async function getUserChatsAndInfo(req, res) {
    const client = getClient();
    
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.decode(token);
      const userId = decodedToken.id_cuenta;
  
      const chatsQuery = "SELECT * FROM get_chats_and_chatters_by_user($1)";
      const chatsData = await client.query(chatsQuery, [userId]);
      const chats = chatsData.rows;
  
      const combinedData = [];
  
      for (const chat of chats) {
        const otherUserId = chat.r_id_other_user;
  
        const userInfoQuery = "SELECT * FROM get_all_public_info_about_user($1)";
        const userInfoData = await client.query(userInfoQuery, [otherUserId]);
  
        const userPhotosQuery = "SELECT * FROM get_photos_user($1)";
        const userPhotosData = await client.query(userPhotosQuery, [otherUserId]);
  
        const chatInfo = {
          id_chat: chat.r_id_chat,
          id_otro_usuario: chat.r_id_other_user,
          nombre: userInfoData.rows[0].r_nombre,
          apellido: userInfoData.rows[0].r_apellido,
          edad: userInfoData.rows[0].r_edad,
          sexo: userInfoData.rows[0].r_sexo,
          descripcion: userInfoData.rows[0].r_descripcion,
          fotos: userPhotosData.rows
        };
  
        combinedData.push(chatInfo);
      }
  
      res.json(combinedData);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    } finally {
      await client.end();
    }
  }















/*export async function getChatsByUser(req, res) {
    const client = getClient();
  
    try {
      // Obtener el token del encabezado de autorización
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.decode(token);
      const userId = decodedToken.id_cuenta;
  
      // Ejecutar la función PostgreSQL
      const query = "SELECT * FROM get_chats_and_chatters_by_user($1)";
      const data = await client.query(query, [userId]);
  
      // Obtener los resultados
      const chats = data.rows.map(row => ({
        id_chat: row.r_id_chat,
        id_otro_usuario: row.r_id_other_user
      }));
  
      // Envía los datos como respuesta
      res.json(chats);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    } finally {
      await client.end();
    }
  }

  export async function getDataOfUserForChat(req, res) {
    const client = getClient();
  
    try {
        const {
            user_id
          } = req.body;
  
      const query = "SELECT * FROM get_all_public_info_about_user($1)";
      const data = await client.query(query, [user_id]);
    
      const queryfotos = "SELECT * FROM get_photos_user($1)";
      const datafotos = await client.query(queryfotos, [user_id])
  
      const userData = {
        id: user_id,
        nombre: data.rows[0].r_nombre,
        apellido: data.rows[0].r_apellido,
        edad: data.rows[0].r_edad,
        sexo: data.rows[0].r_sexo,
        descripcion: data.rows[0].r_descripcion,
        fotos: datafotos.rows,
      }
  
      // Envía los datos del usuario como respuesta
      res.json(userData);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    } finally {
      await client.end();
    }
  }  */