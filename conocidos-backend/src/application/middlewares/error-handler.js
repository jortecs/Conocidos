/*Tenemos una función que recibe como parámetro la función de cada controlador,
la ejecuta (resolve)
y si  hay algún error, lo mostrará por consola y lanzará un 500
*/

export const asyncHandler = controller => (req, res, next) => Promise
  .resolve(controller(req, res, next))
  .catch((err) => {
    console.error('Request error:' + err.toString());
    if (err) return res.sendStatus(500).send();
});
 
export const socketHandler = controller => msg => Promise
  .resolve(controller(msg))
  .catch((err) => {
    console.error('Socket error:' + err);
});