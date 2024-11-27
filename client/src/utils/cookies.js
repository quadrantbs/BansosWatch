import Cookies from "js-cookie";

function setCookies(name, data) {
  Cookies.set(name, data, { expires: 1 });
}

function getCookies(name) {
  return Cookies.get(name);
}

function removeCookies(name) {
  Cookies.remove(name);
}

const tokenCookiesName = "bansoswatch_access_token";
const userCookiesName = "bansoswatch_user";

export { setCookies, getCookies, removeCookies, tokenCookiesName, userCookiesName };
