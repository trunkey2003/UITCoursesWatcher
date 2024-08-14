import axios from "axios";
import https from "https";
import sound from "sound-play";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import open from "open";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const successAlertPath = join(__dirname, "alert.mp3");
const errorAlertPath = join(__dirname, "error.mp3");

import clipboardy from "clipboardy";

const coursesWantToRegister = ["EC337.P12.TMCL"];

const accessToken =
  "";
let currentRegisterCourse = [];

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

setInterval(async () => {
  try {
    const { data } = await instance.get("https://dkhpapi.uit.edu.vn/courses", {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: `Bearer ${accessToken}`,
      }
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
      if (
        JSON.stringify(currentRegisterCourse) !==
        JSON.stringify(availableCourse)
      ) {
        await open("https://dkhp.uit.edu.vn/app/reg");
        availableCourse.forEach((course) => {
          clipboardy.writeSync(course["malop"]);
        });
      }
      currentRegisterCourse = availableCourse;
    } else {
      console.log("Không có lớp nào có thể đăng ký");
    }
  } catch (err) {
    console.log("Không thể kết nối đến server");
    console.log(err);
    sound.play(errorAlertPath);
  }
}, 2000);
