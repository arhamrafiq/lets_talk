import Image from "next/image"

const EmptyState = () => {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8 h-full flex justify-center items-center bg-gray-100">
        <div className="flex text-center item-center flex-col">
            <Image
              alt="logo"
              height="48"
              width="48"
              className="mx-auto w-auto"
              src="/images/logo.png"
            />
            <h3 className="mt-2 text-2xl font-semibold text-gray-900">
                Lets Start A Chat
            </h3>
        </div>
    </div>
  )
}

export default EmptyState