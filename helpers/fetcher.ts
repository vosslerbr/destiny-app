import axios from "axios";

const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url);

    return res.data;
  } catch (err) {
    console.error("Error fetching url: " + url);
    console.error(err);
    return err;
  }
};

export default fetcher;
