import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";

const registrar = async (req, res)=>{

  //registros duplicados
  const {email} = req.body;
  const existeUsuario = await Usuario.findOne({email});

  if(existeUsuario){
    const error = new Error("Usuario Ya Registrado")
    return res.status(400).json({msg: error.message})
  }

  try {
    
    const usuario = new Usuario(req.body)
    usuario.token= generarId();
    const userSave = await usuario.save()
    res.json(userSave)
  } catch (error) {
    console.log(error)
  }
};

const autenticar = async (req, res)=>{
  const {email, password}= req.body;
  const usuario= await Usuario.findOne({email});

  if(!usuario){
    const error = new Error("Usuario No Existe")
    return res.status(404).json({msg: error.message})
  };

  if(!usuario.confirmado){
    const error = new Error("Cuenta No Confirmada")
    return res.status(403).json({msg: error.message})
  };

  if(await usuario.comprobarPassword(password)){
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    })
  }else{
    const error = new Error("Password Incorrecto")
    return res.status(403).json({msg: error.message})
  }

};

const confirmar = async (req, res)=>{

const {token}= req.params
const userConfirm = await Usuario.findOne({token});

if(!userConfirm){
  const error = new Error("Hubo un Error")
  return res.status(403).json({msg: error.message})
};

try {
  userConfirm.confirmado = true;
  userConfirm.token= "";
  await userConfirm.save();
  res.json({msg : 'Usuario Confirmado Correctamente'})
} catch (error) {
  console.log(error)
}


};

const olvidePassword = async (req, res)=>{

  const {email}= req.body
  const usuario = await Usuario.findOne({email});
  
    if(!usuario){
      const error = new Error("Usuario No Existe")
      return res.status(403).json({msg: error.message})
    };
  
    try {
      usuario.token = generarId();
      await usuario.save();
      res.json({msg : '¡Email Enviado! Revisa Tu Bandeja de Entrada'})
    } catch (error) {
      console.log(error)
    }
  
  
  };

const comprobarToken = async (req, res)=>{

    const {token}= req.params
    const usuario = await Usuario.findOne({token});
    
      if(usuario){
        res.json({msg : '¡Token valido!'})
      }else{
        const error = new Error("Token No Valido")
        return res.status(404).json({msg: error.message})
      };
     
    };

const newpassword = async (req, res)=>{

  const {token}= req.params;
  const {password}= req.body;
  const usuario = await Usuario.findOne({token});

  if(usuario){
    usuario.password = password;
    usuario.token = "";
    try {
      await usuario.save();
      res.json({msg: "Password Modificado Correctamente"})
    } catch (error) {
      console.log(error);
    }
  }else{
    const error = new Error("Token No Valido")
    return res.status(404).json({msg: error.message})
  };
};

const perfil = async (req, res)=>{
 const {usuario} = req;

 res.json(usuario)
};

export {registrar, 
  autenticar, 
  confirmar, 
  olvidePassword, 
  comprobarToken, 
  newpassword, 
  perfil};