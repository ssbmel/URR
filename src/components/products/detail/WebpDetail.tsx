import useGetProductDetail from "@/hooks/useGetProductDetail";
import DetailInflu from "./DetailInflu";
import share from "../../../../public/icon/share.png";
import Image from "next/image";
import expiredCart from "../../../../public/icon/cartGray.png";
import cart from "../../../../public/icon/장바구니.png";
import { addCartItems, userCartItems } from "@/services/cart/cart.service";
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";

interface WebpDetailProps {
  id: string;
  handleBuy: () => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  title: string;
  main_img: string;
  nickname: string;
  end: number;
}

export default function WebpDetail({
  id,
  handleBuy,
  quantity,
  setQuantity,
  title,
  main_img,
  nickname,
  end
}: WebpDetailProps) {
  const { data } = useGetProductDetail({ id });
  const { data: user } = useUserData();
  const userId = user?.id;
  const endDate = data?.end;
  const isExpired = endDate && new Date(endDate) < new Date();
  const cost = parseFloat(data?.cost);
  const price = parseFloat(data?.price);
  const discountPercentage = ((cost - price) / cost) * 100;
  const discountPercentageInteger = Math.floor(discountPercentage);
  const totalPrice = quantity * price;
  const router = useRouter();
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("URL이 클립보드에 복사되었습니다!");
      })
      .catch((error) => {
        console.error("URL 복사 실패:", error);
      });
  };

  const addToCart = async () => {
    const userCartItem = await userCartItems({ id, userId });
    if (userId) {
      if (userCartItem?.length !== 0) {
        alert("이미 장바구니에 있습니다!");
      } else {
        await addCartItems({
          user_id: userId,
          product_id: id,
          name: title,
          amount: price,
          quantity,
          main_img,
          nickname,
          end
        });
        const cart = confirm("장바구니로 이동하시겠습니까?");
        if (cart === true) {
          router.push("/cart");
        }
      }
    } else {
      alert("로그인이 필요합니다!");
      router.push("/login");
    }
  };

  return (
    <>
      <div className="hidden lg:block">
        <div className="flex justify-center items-center">
          <div className="flex gap-8 my-8">
            <div className="flex flex-col gap-4  w-[476px] relative">
              {data && (
                <>
                  <div className="w-[476px] h-[460px] relative">
                    <Image
                      src={data?.main_img}
                      alt={data?.title}
                      fill
                      sizes="460px"
                      priority
                      className={`rounded-md object-cover ${isExpired ? "opacity-50" : ""}`}
                    />
                    {isExpired && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                        <p className="text-[#FFFFFE] text-[20px] ">판매 종료</p>
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className="w-full h-[148px] rounded-lg bg-[#E1EEFE] text-[20px] flex flex-col justify-center mt-5 p-4 gap-[12px] px-[14px] py-[12px]">
                <p className=" font-semibold text-[#0051B2]">주문 전 확인해주세요!</p>
                <p className="text-[18px] text-[#4C4F52]">{data?.text}</p>
              </div>
            </div>
            <div className="w-[612px] h-[843px] py-[48px] px-[54px] divide-y-2 shadow-[0px_1px_8px_0px_rgba(0,_0,_0,_0.25),_0px_0px_4px_0px_rgba(0,_0,_0,_0.08),_0px_0px_1px_0px_rgba(0,_0,_0,_0.08)] rounded-xl">
              <div className="my-[20px] mx-4">
                <DetailInflu userId={data?.user_id} />
                <div className="flex justify-between items-cente py-4">
                  <p className="text-[24px] flex items-center font-normal text-[#1B1C1D]">{data?.title}</p>
                  <div>
                    <Image src={share} alt="공유하기" width={38} height={38} onClick={handleShare} />
                  </div>
                </div>
                <p className="text-gray-300 line-through font-light text-[18px] mt-4">{cost.toLocaleString()}</p>
                <p className="my-1 text-[20px]">
                  <span className={`${isExpired ? "text-[#B2B5B8]" : "text-red-500"}`}>
                    {discountPercentageInteger}%
                  </span>
                  <span className={`ml-1 font-medium ${isExpired ? "text-[#B2B5B8]" : "text-[#1B1C1D]"}`}>
                    {price.toLocaleString()} 원
                  </span>
                </p>
              </div>

              <div className="m-4 mx-auto w-full flex flex-col p-4">
                <div className="flex flex-col gap-[14px] my-2 text-[20px] ">
                  <div className="flex">
                    <span className="w-[120px] text-[#4C4F52]">진행기간</span>
                    <span className="text-[#1B1C1D]">
                      {data?.start} ~ {data?.end}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-[120px] text-[#4C4F52]">배송 예정일</span>
                    <span className="text-[#1B1C1D]">08.21 순차적으로 출고</span>
                  </div>
                  <div className="flex">
                    <span className="w-[120px] text-[#4C4F52]">택배사</span>
                    <span className="text-[#1B1C1D]">cj 대한통운</span>
                  </div>
                  <div className="flex">
                    <span className="w-[120px] text-[#4C4F52]">배송비</span>
                    <div className="flex flex-col">
                      <span className="text-[#1B1C1D]">3,000원</span>
                      <span className="text-[18px] text-[#989C9F]">제주 5,000 원 / 도서산간 5,000 원</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-8 text-[20px]">
                  <p>주문수량</p>
                  <div className="flex items-center justify-center border rounded-md border-gray-400 bg-white w-[80px] h-[35px]">
                    <button
                      className="w-1/3 h-full hover:text-gray-400"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="w-1/3 h-full text-center border-none outline-none bg-white"
                      value={quantity}
                      readOnly
                    />
                    <button className="w-1/3 h-full hover:text-gray-400" onClick={() => setQuantity(quantity + 1)}>
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between px-4 py-8 text-[20px]">
                  <p>총 상품금액</p>
                  <p>{totalPrice.toLocaleString()} 원</p>
                </div>
                <div className="w-full  ">
                  <div className="flex items-center gap-2 justify-evenly py-2">
                    <div className="relative w-[63px] h-[63px]">
                      <Image
                        src={isExpired ? expiredCart : cart}
                        alt="장바구니로고"
                        fill
                        sizes="63px"
                        className={isExpired ? "cursor-not-allowed" : ""}
                        onClick={addToCart}
                      />
                    </div>
                    <div>
                      <button
                        onClick={handleBuy}
                        className={`w-[429px] h-[60px] text-white text-[18px] rounded-md ${
                          isExpired ? "bg-[#F2F2F2] text-[#bcbebf]  cursor-not-allowed" : "bg-[#1A82FF]"
                        }`}
                        disabled={isExpired}
                      >
                        {isExpired ? "판매 종료" : "구매하기"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}