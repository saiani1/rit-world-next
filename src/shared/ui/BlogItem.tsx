export const BlogItem = () => {
  return (
    <li className="w-[280px] p-[20px] bg-slate-200/50 rounded-[5px]">
      <button
        type="button"
        className="flex flex-col items-center gap-y-[15px]"
      >
        <div className="w-full h-[180px] bg-slate-300/50 overflow-hidden rounded-[5px]">
          {/* <img src={profileImage} /> */}
        </div>
        <div className="flex flex-col text-start gap-y-[5px] px-[4px]">
          <h3 className="leading-tight text-[17px] font-semibold text-[#555]">Pariatur incididunt cillum enim exercitation.</h3>
          <p
            className="leading-snug text-[14px] text-[#666] line-clamp-2"
          >
            Deserunt qui quis nostrud in commodo anim mollit proident quis irure mollit ex exercitation. Mollit reprehenderit anim ipsum ullamco laborum minim tempor. Esse cillum magna est consequat in mollit ipsum Lorem aliqua ipsum quis sint sunt tempor. Velit laboris magna est et anim.
          </p>
        </div>
      </button>
    </li>
  )
}
