import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const DESIGNIFY_API_KEY = process.env.DESIGNIFY_API_KEY;

const designIds = [
  "4954991c-da85-436c-a2e0-9b48447383de", // Oak
  "23526cf3-d999-4c6a-a028-e5a1393e6fab", // Platinum
  "8d30f626-7fee-46a1-ac3e-ec4f4eb15846", // SALE
  "1303a8bb-ed42-452e-b79c-7a8cc7253dd4", // Clouds
  "c0c5f694-65ce-4ba9-a785-55bbc8439abe", // Red Cloth
];

const IMAGE_DIR = `${process.cwd()}/dist/client/output/`;
const IMAGE_ROOT = `/dist/client/output/`;

const INPUT_IMAGE_DIR = `${process.cwd()}/dist/client/input/`;

async function downloadFile(fileUrl, outputLocationPath) {
  const writer = fs.createWriteStream(outputLocationPath);

  return axios({
    method: "get",
    url: fileUrl,
    responseType: "stream",
  }).then((response) => {
    //ensure that the user can call `then()` only when the file has
    //been downloaded entirely.

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on("error", (err) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on("close", () => {
        if (!error) {
          resolve(true);
        }
        //no need to call the reject here, as it will have been called in the
        //'error' stream;
      });
    });
  });
}

const getBaseFilename = (url) => {
  const basename = path.basename(url);
  return basename.split("?")[0];
};

const gen_uuid = () => {
  var u = "",
    i = 0;
  while (i++ < 36) {
    var c = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"[i - 1],
      r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    u += c == "-" || c == "4" ? c : v.toString(16);
  }
  return u;
};

const createSingleAd = async ({ designId, form }) => {
  const url = `https://api.designify.com/v1.0/designify/${designId}`;
  try {
    console.time(designId);
    const response = await axios({
      method: "post",
      url,
      timeout: 1000 * 15, // Wait for 15 seconds max
      data: form,
      responseType: "arraybuffer",
      encoding: null,
      headers: {
        ...form.getHeaders(),
        "X-Api-Key": DESIGNIFY_API_KEY,
      },
    });
    console.timeEnd(designId);
    const filename = `ad-${gen_uuid()}.png`;
    console.log(">>>>> Done", url, response.status, filename);

    if (response.status != 200) {
      const error = `Error: ${response.status} ${response.statusText}`;
      throw new Error(error);
    }

    fs.writeFileSync(`${IMAGE_DIR}${filename}`, response.data);

    return `${IMAGE_ROOT}${filename}`;
  } catch (error) {
    console.log(error);
  }
};

export const createAd = async (options) => {
  const { imageUrl } = options;

  await fs.promises.mkdir(IMAGE_DIR, { recursive: true });
  await fs.promises.mkdir(INPUT_IMAGE_DIR, { recursive: true });

  console.log("Generating ads of", imageUrl);
  const basename = getBaseFilename(imageUrl);
  const tempImage = `${INPUT_IMAGE_DIR}${gen_uuid()}-${basename}`;
  await downloadFile(imageUrl, tempImage);
  console.log("Downloaded", tempImage);

  const promises = designIds.map(async (designId) => {
    const form = new FormData();
    form.append("image_file", fs.createReadStream(tempImage));

    return await createSingleAd({ designId, form });
  });

  return await Promise.all(promises).then((values) => {
    console.log("Generated images:", values);
    return values.filter(Boolean);
  });
};
