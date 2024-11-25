import React, { ReactElement, useEffect, useRef, useState } from "react"
import HTMLFlipBook from "react-pageflip"
import './flipbookStyles.css'
import { PageFlip } from "page-flip";


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
        
        flipBookRef.current?.flipNext();
      };
    
    const prevButtonClick = () => {
        flipBookRef.current?.flipPrev();
      };

    const onPage = (e : {data:number}) => {
        
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

    </div>
        </>
    )
}

export default PictureBook