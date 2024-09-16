import React, { ReactElement, useEffect, useRef, useState } from "react"
import HTMLFlipBook from "react-pageflip"
import './flipbookStyles.css'
import { Flip, PageFlip } from "page-flip";


const PageCover = React.forwardRef<HTMLDivElement,{children:React.ReactNode}>((props, ref) => {
    return (
      <div className="page page-cover" ref={ref} data-density="hard">
        <div className="page-content">
          <h2>{props.children}</h2>
        </div>
      </div>
    );
  });


const Page = React.forwardRef<HTMLDivElement, {number: number, imageUrl?:string, children?:React.ReactNode}>((props, ref) => {
    console.log(props)
    return (
        <div className="page" ref={ref}>
          <div className="page-content">
            
            {props.imageUrl && (
              <div
                className="page-image"
                style={{
                  backgroundImage: `url(${props.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '100%',
                  width: '100%',
                }}
              ></div>
            )}
            
            {props.children && <div className="page-text">{props.children}</div>}
            <div className="page-footer">{props.number + 1}</div>
          </div>
        </div>
      );
});


const PictureBook = ({urls} : {urls : string[]}) => {
    const[pages,setPages] = useState<number>(0);
    const[totalPages, setTotalPages] = useState<number>(0);
    let flipBookRef= useRef<PageFlip | null>(null);
    

    const nextButtonClick = () => {
        console.log("FLips: ", flipBookRef.current?.flipNext())
        flipBookRef.current?.flipNext();
      };
    
    const prevButtonClick = () => {
        flipBookRef.current?.flipPrev();
      };

    const onPage = (e : {data:number}) => {
        console.log("props: ", e.data)
        setPages(e.data)

    }

    useEffect(() => {
        if (flipBookRef.current) {
            setTotalPages(flipBookRef.current.getPageCount());
        }
    }, [urls]);

    const bookPages = [
        ...(urls.length > 0
          ? urls.map((url, index) => (
              <Page key={`${index}-${url}`} number={index} imageUrl={url} />
            ))
          : [
              <Page key="placeholder" number={0}>
                <div className="text-center text-white">
                  No images to display. Please add images to your book.
                </div>
              </Page>,
            ]),
      ];
    

    return(
        <>
        <div className="relative flex justify-center items-center overflow-visible">
      <button
        className="absolute text-white top-1/2 left-[-250px] transform -translate-y-1/2
        bg-[#1C1A1C] w-[10em] h-[3em] rounded-full flex justify-center items-center cursor-pointer
        transition-all duration-450 ease-in-out
        hover:bg-gradient-to-b from-[#A47CF3] to-[#683FEA]
        hover:shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.4),
        inset_0px_-4px_0px_0px_rgba(0,0,0,0.2),
        0px_0px_0px_4px_rgba(255,255,255,0.2),
        0px_0px_180px_0px_#9917FF]"
        onClick={prevButtonClick}
      >
        Previous
      </button>

      <HTMLFlipBook 
      key={urls.length}
        ref={(el) => { 
            if(el) flipBookRef.current= el.pageFlip()
         }}
         width={550}
         height={773}
         minWidth={300} 
         maxWidth={1200}
         minHeight={550}
         maxHeight={773}
         drawShadow={true}
         size="stretch"
         flippingTime={1000}
         showCover={true}
         className="my-flipbook"
         startPage={0}
         usePortrait={true} 
         startZIndex={0} 
         autoSize={true} 
         maxShadowOpacity={0.5} 
         style={{ margin: '0 auto' }} 
         clickEventForward={true} 
         useMouseEvents={true} 
         mobileScrollSupport={false}
         swipeDistance={30}
         showPageCorners={false}
         onFlip={onPage}
         disableFlipByClick={false}>
            <PageCover>BOOK TITLE</PageCover>
            {bookPages}
            <PageCover>THE END</PageCover>
        </HTMLFlipBook>

      <button
        className="absolute text-white top-1/2 right-[-250px] transform -translate-y-1/2
        bg-[#1C1A1C] w-[10em] h-[3em] rounded-full flex justify-center items-center cursor-pointer
        transition-all duration-450 ease-in-out
        hover:bg-gradient-to-b from-[#A47CF3] to-[#683FEA]
        hover:shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.4),
        inset_0px_-4px_0px_0px_rgba(0,0,0,0.2),
        0px_0px_0px_4px_rgba(255,255,255,0.2),
        0px_0px_180px_0px_#9917FF]"
        onClick={nextButtonClick}
      >
        Next
      </button>
    </div>
        </>
    )
}

export default PictureBook