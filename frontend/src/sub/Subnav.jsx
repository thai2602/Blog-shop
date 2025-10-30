export default function SubNav({ items = [], title = "Subnav" }) {
  return (
    <nav>
      <ul className="flex space-x-6">
        {items.map((item, index) => (
          <li key={index} className={`relative ${item.subMenu ? "group"  : ""}`}>
            <button className="flex items-center hover:text-blue-500 transition h-full">
              {item.name}
            </button>

            {item.subMenu && (
              <ul
                className="absolute left-1/2 -translate-x-1/2 mt-2 w-40 bg-white rounded-b-lg
                           opacity-0 group-hover:opacity-100 invisible group-hover:visible
                           transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"
              >
                {item.subMenu.map((sub, subIndex) => (
                  <li
                    key={subIndex}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {sub}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
