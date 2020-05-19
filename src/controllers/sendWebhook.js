import axios from "axios";

function sendWebhook(url, info) {
  axios
    .post(url, info)
    .then(response => {
      return response.status === 200;
    })
    .catch(error => {
      console.log(error);
      return false;
    });
  return true;
}

export default sendWebhook;
