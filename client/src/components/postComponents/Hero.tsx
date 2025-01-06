
export default function Hero() {
  return (
    <div className="relative h-[50vh] min-h-[400px] bg-cover bg-center flex items-center justify-center" style={{backgroundImage: 'url("/src/assets/homeBG.jpg")'}}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative text-center text-white z-10">
        <img
          src="/src/assets/Community-2.png"
          alt="Logo"
          width={200}
          height={200}
          className="mx-auto mb-4 opacity-50 shadow-lg rounded-full"
        />
        <h1 className="text-4xl font-bold mb-2">Welcome to Our Community</h1>
        <p className="text-xl">Connect, Share, and Grow Together</p>
      </div>
    </div>
  )
}
