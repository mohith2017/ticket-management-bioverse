import Head from "next/head";
import Form from "../src/components/form";

export default function Home() {
  return (
    <>
      <div>
        <Head>
          <title>Bioverse Ticket Management</title>
        </Head>
        <div className="md:w-1/2 w-5/6 p-5 border mx-auto my-32 bg-black rounded-lg">
          <h1 className="text-white text-xl font-bold">
            Raise Ticket
          </h1>
          <br></br>
          <Form />
        </div>
      </div>
    </>
  );
}
