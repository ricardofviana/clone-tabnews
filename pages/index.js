import Image from "next/image";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <h1>Cecilia Ghibli!</h1>
      <Image
        src="/cecilia_ghibli.png"
        alt="Cecilia Ghibli"
        width={600}
        height={400}
        style={{
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        }}
      />
    </main>
  );
}
