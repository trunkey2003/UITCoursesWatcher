const axios = require("axios");
const sound = require("sound-play");
const path = require("path");
const successAlertPath = path.join(__dirname, "alert.mp3");
const errorAlertPath = path.join(__dirname, "error.mp3");

const coursesWantToRegister = [
  "IS207.O11.HTCL",
  "IS207.O11.HTCL.1",
  "IS207.O11.HTCL.2",
  "IS207.O11.TMCL",
  "IS207.O11.TMCL.1",
  "IS207.O11.TMCL.2",
  "IS207.O12.HTCL",
  "IS207.O12.HTCL.1",
  "IS207.O12.HTCL.2",
  "IS211.O11.HTCL",
  "IS211.O11.HTCL.1",
  "IS211.O11.HTCL.2",
  "IS336.O11.HTCL",
  "IS336.O11.HTCL.1",
  "IS336.O12.HTCL",
  "IS336.O12.HTCL.1",
];

const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTUzNDgzOTIsInN1YiI6IjIxNTIxMDQ5In0.mIvauK3wCYKEfvcl8UkBlIyZPxRUki6sOu-Jo-xlfAk";

setInterval(async () => {
  try {
    const { data } = await axios.get("https://dkhpapi.uit.edu.vn/courses", {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language":
        "vi-VN,vi;q=0.9,en-GB;q=0.8,en;q=0.7,fr-FR;q=0.6,fr;q=0.5,en-US;q=0.4",
      authorization:
        `Bearer ${accessToken}`,
      "sec-ch-ua":
        '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      Referer: "https://dkhp.uit.edu.vn/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: null,
    method: "GET",
  });
  const courses = data.courses || [];
  const availableCourse = [];
  courses.forEach((course) => {
    if (coursesWantToRegister.includes(course["malop"])) {
      if (course["siso"] - course["dadk"] > 0) {
        console.log(
          `${course["malop"]}
              Đang có sỉ số ${course["dadk"]}/${course["siso"]}`
        );
        availableCourse.push(course);
      }
    }
  });
  if (availableCourse.length > 0) {
    sound.play(successAlertPath);
  } else {
    console.log("Không có lớp nào có thể đăng ký");
  }
  } catch(err) {
    console.log("Không thể kết nối đến server");
    console.log(err);
    sound.play(errorAlertPath);
  }
}, 2000);
