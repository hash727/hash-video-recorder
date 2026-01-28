'use client'


import Link from "next/link";
import { Button } from "./ui/button";
import { FacebookIcon, Instagram, LinkedinIcon, YoutubeIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black">
      <div className="max-w-[1280px] mx-auto px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-32 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col gap-4">
              <svg width="70" height="36" viewBox="0 0 70 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0)">
                  <path d="M67.2446 17.0815L67.2075 17.1187C67.4677 16.4125 67.988 16.1523 68.434 16.1523C69.0659 16.1523 69.6234 16.6355 69.6234 17.3417C69.6234 17.4904 69.6234 17.6762 69.5491 17.8992C68.2482 21.2444 65.4977 22.9541 62.8216 23.2143C61.5951 25.2957 59.588 26.8196 56.726 26.8196C52.6375 26.8196 50.8163 23.586 50.8163 20.055C50.8163 15.7063 53.5668 10.8744 58.1756 10.8744C59.1791 10.8744 60.034 11.0975 60.7402 11.3948C62.8216 12.1753 64.1597 14.8886 64.1597 17.7877C64.1597 18.7169 64.0853 19.6461 63.8623 20.5382C65.2376 20.055 66.5384 18.9399 67.2446 17.0815ZM59.4765 13.9222V13.8851C58.6588 13.8851 58.1756 14.9629 58.1756 16.2638C58.1756 18.1594 59.2163 19.9063 60.8517 20.5382C61.1119 19.7205 61.2234 18.7913 61.2234 17.7134C61.2234 15.632 60.5915 13.9222 59.4765 13.9222ZM56.7632 24.1063C57.8039 24.1063 58.8446 23.6603 59.6623 22.7311C57.2464 21.6532 55.7225 19.1258 55.7225 16.7098C55.7225 15.8921 55.8712 15.0373 56.0942 14.2939C54.6075 15.5205 53.7526 17.9364 53.7526 20.055C53.7526 22.8054 55.0535 24.1063 56.7632 24.1063Z" fill="black"/>
                  <path d="M51.3902 17.0815L51.353 17.1187C51.6132 16.4125 52.0592 16.1152 52.5052 16.1152C53.1371 16.1152 53.7689 16.6727 53.7689 17.3789C53.7689 17.5647 53.7318 17.7134 53.6574 17.8992C52.2079 21.4302 50.0521 25.5559 46.5955 27.9718L46.5212 28.7152C46.1123 33.1754 43.8451 36.0001 40.9831 36.0001C38.8273 36.0001 37.5636 34.5134 37.5636 32.7665C37.5636 29.6072 40.7972 28.455 43.8079 26.5223C43.8822 25.7417 43.9194 24.8497 43.9565 23.8461C42.4698 25.4815 40.8716 26.1506 39.4592 26.1506C36.6344 26.1506 34.33 23.8461 34.33 20.3152C34.33 14.8886 37.8981 11.3205 41.8751 11.3205H41.9123C44.6256 11.3205 47.5247 12.77 47.5247 15.3718C47.5247 16.2267 47.153 20.8727 46.8557 24.478C48.8627 22.5824 50.5353 19.4975 51.3902 17.0815ZM39.868 23.4745C41.2433 23.4745 43.1017 22.6196 44.2539 18.4196C44.4397 17.4904 44.5512 16.6727 44.5141 15.7063C44.2911 14.7028 43.4362 14.1081 42.2096 14.1081C39.6822 14.1081 37.2663 16.524 37.2663 20.2037C37.2663 22.4338 38.307 23.4745 39.868 23.4745ZM41.2804 33.2869H41.3176C42.0981 33.2869 42.953 32.7665 43.5105 29.4214C41.8751 30.3877 40.3512 31.3541 40.3512 32.5063C40.3512 32.9895 40.7229 33.2869 41.2804 33.2869Z" fill="black"/>
                  <path d="M34.9821 17.0815L34.945 17.1187C35.2051 16.4125 35.7255 16.1523 36.1715 16.1523C36.8034 16.1523 37.3609 16.6355 37.3609 17.3417C37.3609 17.4904 37.3609 17.6762 37.2866 17.8992C35.9857 21.2444 33.2352 22.9541 30.5591 23.2143C29.3326 25.2957 27.3255 26.8196 24.4635 26.8196C20.375 26.8196 18.5538 23.586 18.5538 20.055C18.5538 15.7063 21.3042 10.8744 25.9131 10.8744C26.9166 10.8744 27.7715 11.0975 28.4777 11.3948C30.5591 12.1753 31.8972 14.8886 31.8972 17.7877C31.8972 18.7169 31.8228 19.6461 31.5998 20.5382C32.9751 20.055 34.2759 18.9399 34.9821 17.0815ZM27.214 13.9222V13.8851C26.3963 13.8851 25.9131 14.9629 25.9131 16.2638C25.9131 18.1594 26.9538 19.9063 28.5892 20.5382C28.8494 19.7205 28.9609 18.7913 28.9609 17.7134C28.9609 15.632 28.329 13.9222 27.214 13.9222ZM24.5007 24.1063C25.5414 24.1063 26.5821 23.6603 27.3998 22.7311C24.9839 21.6532 23.46 19.1258 23.46 16.7098C23.46 15.8921 23.6087 15.0373 23.8317 14.2939C22.345 15.5205 21.4901 17.9364 21.4901 20.055C21.4901 22.8054 22.791 24.1063 24.5007 24.1063Z" fill="black"/>
                  <path d="M20.4429 15.9083C19.9225 15.9083 19.4765 16.1685 19.1791 16.8747C18.2128 19.3278 16.2056 23.4907 14.1613 23.4907C12.8741 23.4907 11.878 23.1996 10.8714 22.9054C9.84348 22.605 8.80467 22.3013 7.43378 22.3013C6.95058 22.3013 6.28154 22.3757 5.64967 22.4872C7.55325 19.8914 8.26439 16.7477 8.95347 10.8054C7.65601 10.7228 6.6006 10.4831 5.83132 10.241C5.00967 17.7775 4.07661 20.6511 0.669037 23.4907C0.22301 23.8624 0 24.3828 0 24.9032C0 25.7209 0.706212 26.4271 1.59827 26.4271C1.89562 26.4271 2.23013 26.3156 2.56465 26.1669C4.46027 25.312 5.6125 25.089 7.02492 25.089C7.92309 25.089 8.99783 25.3459 10.1485 25.6208C11.4739 25.9376 12.9 26.2784 14.2729 26.2784C17.2835 26.2784 19.2535 23.3421 21.4464 17.6552C21.558 17.4694 21.5951 17.2464 21.5951 17.0605C21.5951 16.3543 21.0376 15.9083 20.4429 15.9083Z" fill="black"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M6.01991 8.70287C6.693 8.93784 7.74382 9.2114 9.10625 9.29233L9.32926 9.29222C13.5294 9.29222 16.2799 6.6904 16.2799 3.56821C16.2799 1.56109 14.7188 0 12.5258 0C9.58944 0 7.54516 2.00712 6.50443 5.98419C5.20352 5.27798 4.31147 4.01424 3.86544 2.41598C3.64242 1.63543 3.15923 1.15223 2.49018 1.15223C1.67247 1.15223 1.1521 1.78411 1.1521 2.63899C1.1521 5.16648 3.12206 7.58245 6.02123 8.69752L6.01991 8.70287ZM9.55227 6.57889C10.1098 4.01424 11.0019 2.78767 12.1913 2.78767C12.8232 2.78767 13.232 3.15936 13.232 3.8284C13.232 5.05497 11.9311 6.50455 9.55227 6.57889Z" fill="black"/>
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="70" height="36" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-base">Product</h3>
              <div className="flex flex-col">
                <Link href="#" className="py-2 text-sm text-black hover:opacity-70">How it works</Link>
                <Link href="#" className="py-2 text-sm text-black hover:opacity-70">Pricing</Link>
                <Link href="#" className="py-2 text-sm text-black hover:opacity-70">Blog</Link>
                <Link href="#" className="py-2 text-sm text-black hover:opacity-70">Features</Link>
                <Link href="#" className="py-2 text-sm text-black hover:opacity-70">Company</Link>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-base">About us</h3>
              <div className="flex flex-col">
                <Link href="#" className="py-2 text-sm text-black hover:opacity-70">Contact</Link>
                <Link href="#" className="py-2 text-sm text-black hover:opacity-70">Careers</Link>
                <Link href="#" className="py-2 text-sm text-black hover:opacity-70">Press</Link>
                <Link href="#" className="py-2 text-sm text-black hover:opacity-70">Support</Link>
                <Link href="#" className="py-2 text-sm text-black hover:opacity-70">Resources</Link>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-base">Documentation</h3>
              <div className="flex flex-col">
                <Link href="#" className="py-2 text-sm text-black hover:opacity-70">API</Link>
                <Link href="#" className="py-2 text-sm text-black hover:opacity-70">Community</Link>
                <Link href="#" className="py-2 text-sm text-black hover:opacity-70">Status</Link>
                <Link href="#" className="py-2 text-sm text-black hover:opacity-70">Guides</Link>
                <Link href="#" className="py-2 text-sm text-black hover:opacity-70">Updates</Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 max-w-md">
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-base">News</h3>
              <p className="text-base text-black">
                Get the latest updates on new features and improvements delivered straight to your inbox.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-3 border border-black text-base placeholder:text-black/60 focus:outline-none"
                />
                <Button variant="secondary">Join</Button>
              </div>
              <p className="text-xs text-black">
                We respect your privacy and only send what matters to you.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="h-px bg-black w-full" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <p>© 2024 Video Prospect AI Share. All rights reserved.</p>
              <Link href="#" className="underline hover:opacity-70">Privacy Policy</Link>
              <Link href="#" className="underline hover:opacity-70">Terms of Service</Link>
              <Link href="#" className="underline hover:opacity-70">Cookie Settings</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="#" className="hover:opacity-70">
                <FacebookIcon className="w-6 h-6" fill="black" />
              </Link>
              <Link href="#" className="hover:opacity-70">
                <Instagram className="w-6 h-6" />
              </Link>
              <Link href="#" className="hover:opacity-70">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M17.1761 4.24268H19.9362L13.9061 11.0201L21 20.2427H15.4456L11.0951 14.6493L6.11723 20.2427H3.35544L9.80517 12.9935L3 4.24268H8.69545L12.6279 9.3553L17.1761 4.24268ZM16.2073 18.6181H17.7368L7.86441 5.78196H6.2232L16.2073 18.6181Z" fill="black"/>
                </svg>
              </Link>
              <Link href="#" className="hover:opacity-70">
                <LinkedinIcon className="w-6 h-6" />
              </Link>
              <Link href="#" className="hover:opacity-70">
                <YoutubeIcon className="w-6 h-6" fill="black" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
