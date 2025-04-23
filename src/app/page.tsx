"use client";

import { useState } from "react";
import EastIcon from "@mui/icons-material/East";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState("deepseek-v3");

  const handleChangeModel = () => {
    setModel(model === "deepseek-v3" ? "deepseek-r1" : "deepseek-v3")
  }

  const queryClient = useQueryClient()
  const router = useRouter();

  const {user} = useUser();
  
    // Mutations
    const {mutate: createChat} = useMutation({
      mutationFn: async () => {
        return axios.post('/api/create-chat', {
          title: input,
          model: model
        })
      },
      onSuccess: (res) => {
        router.push(`/chat/${res.data.id}`)
        queryClient.invalidateQueries({ queryKey: ['chats'] })
      },
    })
    
    const handleSubmit = () => {
      if (input.trim() === "") return;
      if (!user) {
        router.push("/sign-in");
      };
      createChat();
    }


  return (
    <div className="h-screen flex flex-col items-center">
      <div className="h-1/5"></div>

      <div className="w-1/2">
        <p className="text-bold text-2xl text-center">
          Anything I can help you with?
        </p>

        <div className="flex flex-col items-center justify-center mt-4 shadow-lg border-[1px] border-gray-300 h-32 rounded-lg">
          <textarea
            className="w-full rounded-lg p-3 h-30 focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>

          <div className="flex flex-row items-center justify-between w-full h-12 mb-2">
            <div>
              <div
                className={`flex flex-row items-center justify-center rounded-lg border-[1px]
              px-2 py-1 ml-2 cursor-pointer ${
                model === "deepseek-r1"
                  ? "border-blue-300 bg-blue-200"
                  : "border-gray-300"
              } `}
              onClick={handleChangeModel}
              >
                <p className="text-sm">DeepSeek(R1)</p>
              </div>
            </div>
            <div className="flex items-center justify-center border-2 mr-4 border-black p-1 rounded-full"
            onClick = {handleSubmit}>
              <EastIcon></EastIcon>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


