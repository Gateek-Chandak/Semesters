import { Separator } from "@/components/ui/separator";

const PrivacyPolicyTermsConditions = () => {
    return ( 
        <div className="lg:bg-[#f1f0f0]w-full h-dvh">
            <a className="fixed top-4 left-4 flex justify-start gap-2 z-50" href="/">
                <img src="/Objects/SemesterLogo.svg" alt="Semesters Logo" className="w-5 h-auto"/>
                <h1 className="text-xl font-medium">Semesters</h1>
            </a>
            <div className="flex flex-col items-start justify-start h-fit mt-32 px-10">
                <div className="mb-20 flex flex-col gap-10">
                    <h1 className="text-2xl font-medium">Privacy Policy</h1>
                    <p className="mx-10">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi pariatur ipsum modi nulla! Illo, nostrum odit? Non voluptates possimus nihil ducimus, ipsum ipsam quod vero dicta, corporis qui praesentium temporibus!
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga, sit natus. Ratione corporis sit libero! Vel est, molestiae accusamus qui commodi, nam voluptate nobis ratione voluptates optio dolore blanditiis veritatis.
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo nihil dolorem repellat dolorum pariatur sint ducimus atque, alias ullam quis dolore blanditiis saepe molestiae? Officia corrupti assumenda quod aut enim?
                    </p>
                </div>
                <Separator />
                <div className="mb-20 mt-20 flex flex-col gap-10">
                    <h1 className="text-2xl font-medium">Terms and Conditions</h1>
                    <p className="mx-10">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi pariatur ipsum modi nulla! Illo, nostrum odit? Non voluptates possimus nihil ducimus, ipsum ipsam quod vero dicta, corporis qui praesentium temporibus!
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga, sit natus. Ratione corporis sit libero! Vel est, molestiae accusamus qui commodi, nam voluptate nobis ratione voluptates optio dolore blanditiis veritatis.
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo nihil dolorem repellat dolorum pariatur sint ducimus atque, alias ullam quis dolore blanditiis saepe molestiae? Officia corrupti assumenda quod aut enim?
                    </p>
                </div>
            </div>

            <div className="fixed bottom-0 w-[100%] border-t border-gray-200">
                <div className="w-[90%] flex flex-col md:flex-row items-center justify-around pt-10 pb-14 z-50 gap-4 md:gap-10">
                    <a href="/" className="flex justify-start gap-2">
                        <img src="/Objects/SemesterLogo.svg" alt="Semesters Logo" className="w-5 md:w-6 h-auto"/>
                        <h1 className="text-lg md:text-xl font-medium">Semesters</h1>
                    </a>
                    <a href="/privacy-policy-and-terms-conditions" className="text-xs md:text-md text-muted-foreground">Privacy Policy</a>
                    <a href="/privacy-policy-and-terms-conditions" className="text-xs md:text-md text-muted-foreground">Terms & Conditions</a>
                    <h1 className="text-xs md:text-md">
                        Made by <a href="https://www.linkedin.com/in/gateek-chandak/" target="_blank" className="underline">Gateek Chandak</a> & <a href="https://www.davidstirling.me/" target="_blank" className="underline">David Stirling</a>
                    </h1>
                </div>
            </div>
        </div>
     );
}
 
export default PrivacyPolicyTermsConditions;