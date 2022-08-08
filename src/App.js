const makeRequest = (data) => {
  const URL = "http://localhost:5000/get-code";
  return fetch(URL , {
      method : "POST",
      headers : {
          "Content-Type" : "application/json"
      },
      body :JSON.stringify(data)
  }).then(res => res.json())
  .then(res => {
      return res._id;
  });
}
export default makeRequest;