import axios from "axios";
import sound from "sound-play";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import open from "open";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const successAlertPath = join(__dirname, "alert.mp3");
const errorAlertPath = join(__dirname, "error.mp3");

import clipboardy from "clipboardy";

const coursesWantToRegister = ["CE201.O21.MTCL"];

const accessToken =
  "eyJhbGsiOisIazI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDQzNzY2MjcsInN1YiI6IjIxNTIxMDQ5In0.-4UOo-uMDEH9YnOCYjdAmSF3SQgIeERuUKWYUcm6-wI";
let currentRegisterCourse = [];

setInterval(async () => {
  try {
    const { data } = await axios.get("https://dkhpapi.uit.edu.vn/courses", {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language":
          "vi-VN,vi;q=0.9,en-GB;q=0.8,en;q=0.7,fr-FR;q=0.6,fr;q=0.5,en-US;q=0.4",
        authorization: `Bearer ${accessToken}`,
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
