"use client";

import Image from "next/image";
import defaultImg from "../../../public/images/default.png";
import emptyImg from "../../../public/bgImg/emptyImg.png";
import { InfSubscribe, User } from "../../../types/common";
import { MouseEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import EmptyHeartIcon from "../../../public/icon/emptyheart.svg";
import FullHeartIcon from "../../../public/icon/fullheart.svg";
import { useUserData } from "@/hooks/useUserData";
import Link from "next/link";
import { getInfluencerData } from "@/services/users/influencer/influencer.service";

function InfluencerList() {
  const { data: user } = useUserData();
  const [subscribeIds, setSubscribeIds] = useState<string[]>([]);

  const getSubscribeData = async () => {
    try {
      if (!user) return null;

      const response = await fetch(`/api/subscribe?user_id=${user.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSubscribeIds(data.map((d: InfSubscribe) => d.infuser_id));
    } catch (error) {
      console.log("Failed to fetch subscription data:", error);
    }
  };

  const { data: infUser } = useQuery({
    queryKey: ["user"],
    queryFn: () => getInfluencerData()
  });

  useEffect(() => {
    getSubscribeData();
  }, [user]);

  const subscribedHandler = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, inf: User) => {
    e.stopPropagation();
    const newInfUser: InfSubscribe = {
      user_id: user.id,
      infuser_id: inf.id
    };
    subscribedMutation(newInfUser);
  };

  const subscribedInfUser = async (data: InfSubscribe) => {
    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    await getSubscribeData();
    return response.json();
  };

  const { mutate: subscribedMutation } = useMutation<InfSubscribe, unknown, InfSubscribe>({
    mutationFn: (data) => subscribedInfUser(data)
  });

  const cancelSubscribedInfUser = async (data: InfSubscribe) => {
    if (!data.user_id || !data.infuser_id) return;
    const response = await fetch("/api/subscribe", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    await getSubscribeData();
    return response.json();
  };

  const { mutate: cancelSubscribedMutation } = useMutation<InfSubscribe, unknown, InfSubscribe>({
    mutationFn: (data) => cancelSubscribedInfUser(data)
  });

  return (
    <div className="w-full bg-[#F4F4F4] mx-auto">
      <div className="w-full min-h-[200px] h-[30%] p-4 bg-[#FFFFFE]">
        <h1 className="font-bold text-lg">내가 구독중인 인플루언서</h1>
        {subscribeIds.length === 0 ? (
          <div className="flex flex-col items-center mx-auto">
            <div className="relative w-[150px] h-[100px] my-3">
              <Image src={emptyImg} alt="empty" fill sizes="100px" className="mx-auto my-5 object-cover" />
            </div>
            <p className="text-[#4C4F52] text-[16px] my-5">현재 구독중인 인플루언서가 없습니다.</p>
          </div>
        ) : (
          <div className="w-auto flex overflow-x-auto mt-5 gap-3  scrollbar-hide">
            {infUser
              ?.filter((inf) => subscribeIds.includes(inf.id))
              .map((inf) => (
                <div className="grid text-center" key={inf.id}>
                  <div className="relative w-[90px] h-[90px] mb-2">
                    <Link href={`influencer/profile/${inf.id}`}>
                      <div className="relative w-[90px] h-[90px]">
                        <Image
                          src={inf.profile_url || defaultImg}
                          alt="img"
                          fill
                          sizes="90px"
                          className="rounded-md object-cover gradient-border"
                        />
                      </div>
                    </Link>
                    <div className="absolute bottom-0.5 right-1">
                      {subscribeIds.includes(inf.id) ? (
                        <button
                          onClick={() =>
                            cancelSubscribedMutation({
                              infuser_id: inf.id,
                              user_id: user.id
                            })
                          }
                        >
                          <FullHeartIcon />
                        </button>
                      ) : (
                        <button onClick={(e) => subscribedHandler(e, inf)}>
                          <EmptyHeartIcon />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[13px] mb-2">{inf.nickname}</p>
                </div>
              ))}
          </div>
        )}
      </div>
      <div className="w-full h-[70%] p-4 my-2 bg-[#FFFFFE]">
        <h1 className="font-bold text-lg mb-4">인플루언서</h1>
        <div className="w-full grid grid-cols-3 auto-rows-max overflow-y-auto scrollbar">
          {infUser?.map((inf) => (
            <div key={inf.id} className="flex flex-col items-center justify-center w-[106px] text-center mx-auto">
              <div className="relative w-[106px] h-[106px] mb-2">
                <Link href={`influencer/profile/${inf.id}`} key={inf.id}>
                  <div className="relative w-[106px] h-[106px]">
                    <Image
                      src={inf.profile_url || defaultImg}
                      alt="img"
                      fill
                      sizes="106px"
                      className="rounded-md object-cover gradient-border"
                    />
                  </div>
                </Link>
                <div className="absolute bottom-0.5 right-2">
                  {subscribeIds.includes(inf.id) ? (
                    <button
                      onClick={() =>
                        cancelSubscribedMutation({
                          infuser_id: inf.id,
                          user_id: user.id
                        })
                      }
                    >
                      <FullHeartIcon />
                    </button>
                  ) : (
                    <button onClick={(e) => subscribedHandler(e, inf)}>
                      <EmptyHeartIcon />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-[#4C4F52] mb-6">{inf.nickname}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InfluencerList;
