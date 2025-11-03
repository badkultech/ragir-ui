export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div
        className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
        style={{
          borderImage: "linear-gradient(45deg, #FEA901, #FD6E34, #FE336A, #FD401A) 1",
          borderImageSlice: 1,
          borderTopColor: "transparent",
        }}
      />
    </div>
  );
}