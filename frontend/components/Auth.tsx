import { SignUpInput } from "@het4399/common";
import { ChangeEventHandler, useState } from "react";
import { Link } from "react-router-dom";

export function Auth({ type }: { type: "SignUp" | "SignIn" }) {
    const [postInputes, setPostInput] = useState<SignUpInput>({
        email: "",
        password: "",
        name: "",
    })
    function sendRequest(req: Request, res: Response) {

    }
    return <>
        <div className=' h-screen flex justify-center flex-col'>
            <div className="flex justify-center">
                <div>
                    <div className="px-7">

                        <div className="text-3xl font-extrabold">
                            Create an account
                        </div>
                        <div className="text-slate-400 px-4 pt-1" >
                            {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                            <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                                {type === "signin" ? "Sign up" : "Sign in"}</Link>
                        </div>
                    </div>
                    <div className="pt-1">

                        {type === "signup" ? <LabelInput label={"Name"} placeholder={"Name"}
                            onchange={(e) => {
                                setPostInput({
                                    ...postInputes,
                                    name: e.target.value
                                })
                            }} /> : null}
                        <LabelInput label={"Email"} placeholder={"Email"}
                            onchange={(e) => {
                                setPostInput({
                                    ...postInputes,
                                    email: e.target.value
                                })
                            }} />
                        <LabelInput label={"Password"} placeholder={"Password"}
                            onchange={(e) => {
                                setPostInput({
                                    ...postInputes,
                                    password: e.target.value
                                })
                            }} />
                        <button  type="button" className="mt-5 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"}</button>


                    </div>
                </div>
            </div>
        </div>
    </>;
};
interface LabelInputType {
    label: string;
    onchange: (e: ChangeEventHandler<HTMLInputElement>) => void;
    placeholder: string;
    type?: string;
}
function LabelInput({ label, placeholder, onchange, type }: LabelInputType) {
    return <> <div className="mb-1">
        <label className="block mb-2 text-sm text-black font-semibold pt-3">{label}</label>
        <input onChange={onchange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
    </div>
    </>
}