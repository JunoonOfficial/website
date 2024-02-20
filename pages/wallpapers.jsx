import Header from "@/components/Header";
import getContent from "@/lib/strapi";
import getCommonProps from "@/lib/getCommonProps";
import Radio from "@/components/Radio";
import { useEffect, useMemo, useRef, useState } from "react";
import DesktopMockup from "@/components/DesktopMockup";
import MobileMockup from "@/components/MobileMockup";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import RenderImage from "@/components/RenderImage";
import { twJoin } from "tailwind-merge";
import DownloadButton from "@/components/DownloadButton";

const deviceOptions = ["mobile", "desktop"];

const Wallpapers = ({ wallpapers, navbarLinks, socialLinks, logos }) => {
  const [selectedDevice, setSelectedDevice] = useState(deviceOptions[0]);

  const wallPapersToDisplay = useMemo(
    () => wallpapers.attributes[selectedDevice].data,
    [wallpapers, selectedDevice],
  );

  const [selectedWallpaper, setSelectedWallpaper] = useState(
    wallPapersToDisplay[0],
  );

  const selectedWallPaperRef = useRef(null);

  useEffect(() => {
    if (selectedWallPaperRef.current) {
      selectedWallPaperRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedWallpaper]);

  useEffect(() => {
    if (wallPapersToDisplay.length > 0)
      setSelectedWallpaper(wallPapersToDisplay[0]);
  }, [wallPapersToDisplay]);

  const prevWallpaper = () => {
    const index = wallPapersToDisplay.indexOf(selectedWallpaper);
    if (index === 0) {
      setSelectedWallpaper(wallPapersToDisplay[wallPapersToDisplay.length - 1]);
    } else {
      setSelectedWallpaper(wallPapersToDisplay[index - 1]);
    }
  };

  const nextWallpaper = () => {
    const index = wallPapersToDisplay.indexOf(selectedWallpaper);
    if (index === wallPapersToDisplay.length - 1) {
      setSelectedWallpaper(wallPapersToDisplay[0]);
    } else {
      setSelectedWallpaper(wallPapersToDisplay[index + 1]);
    }
  };

  return (
    <main className="min-h-screen max-w-full bg-lightest text-dark">
      {/* header */}
      <Header
        logo={logos.fullBlack}
        navbarLinks={navbarLinks}
        socialLinks={socialLinks}
      />
      {/* body */}
      <div className="mx-auto max-w-5xl pb-24">
        <h1 className="mb-10 text-center">WALLPAPERS</h1>

        {/* device selection */}
        <div className="mb-10 flex justify-center">
          <Radio
            selectedValue={selectedDevice}
            onChange={setSelectedDevice}
            options={deviceOptions}
          />
        </div>

        {/* wallpaper mockup */}
        <div className="mb-10 flex w-full px-4">
          {/* left button */}
          <button onClick={prevWallpaper}>
            <BsArrowLeftCircleFill className="text-3xl md:text-5xl" />
          </button>

          {/* mobile mockup */}
          {selectedWallpaper && selectedDevice === "mobile" && (
            <div className="relative mx-auto w-2/3 md:w-1/3">
              <MobileMockup image={selectedWallpaper} />

              {/* logo */}
              <div className="absolute left-[12%] top-[5%] size-10">
                <RenderImage image={logos.logoOnlyWhite.data} fill />
              </div>

              {/* download button */}
              <div className="absolute bottom-[5%] left-[12%] z-10">
                <DownloadButton
                  href={selectedWallpaper.attributes.url}
                  className="size-10"
                />
              </div>
            </div>
          )}

          {/* desktop mockup */}
          {selectedWallpaper && selectedDevice === "desktop" && (
            <div className="relative mx-auto w-10/12">
              <DesktopMockup image={selectedWallpaper} />

              {/* logo */}
              <div className="absolute left-[12%] top-[5%] size-10">
                <RenderImage image={logos.logoOnlyWhite.data} fill />
              </div>

              {/* download button */}
              <div className="absolute bottom-[11%] left-[12%] z-10">
                <DownloadButton
                  href={selectedWallpaper.attributes.url}
                  className="size-10"
                />
              </div>
            </div>
          )}

          {/* right button */}
          <button onClick={nextWallpaper}>
            <BsArrowRightCircleFill className="text-3xl md:text-5xl" />
          </button>
        </div>

        {/* wallpaper thumbnails */}
        <div className="wallpaper-thumbs flex overflow-x-auto bg-gray-300 pb-2">
          {wallPapersToDisplay.map((wallpaper) => {
            const selected = wallpaper.id === selectedWallpaper.id;
            return (
              <div
                className={twJoin(
                  "aspect-square w-1/3 p-2 md:w-1/6 shrink-0 cursor-pointer",
                  selected && "bg-slate-500",
                )}
                key={wallpaper.id}
                ref={selected ? selectedWallPaperRef : null}
                onClick={() => setSelectedWallpaper(wallpaper)}
              >
                <div className="relative size-full">
                  <RenderImage
                    image={wallpaper}
                    fill
                    className="rounded-lg"
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 33vw, 18vw"
                    priority
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};
export default Wallpapers;

export const getStaticProps = async () => {
  const { data: wallpapers } = await getContent({ name: "wallpaper" });
  const commonProps = await getCommonProps();

  return {
    props: {
      wallpapers,
      ...commonProps,
    },
  };
};
