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


const Page = React.forwardRef<HTMLDivElement, {number: number, children:React.ReactNode}>((props, ref) => {
    return (
        <div className="page" ref={ref}>
             <div className="page-content">
                <h2 className="page-header">Page header - {props.number}</h2>
                <div className="page-image"></div>
                <div className="page-text">{props.children}</div>
                <div className="page-footer">{props.number + 1}</div>
            </div>

        </div>
    );
});


const PictureBook = () => {
    const[pages,setPages] = useState<number>(0);
    const[totalPages, setTotalPages] = useState<number>(0);
    let flipBookRef= useRef<PageFlip>();
    

    const nextButtonClick = () => {
        console.log("FLips: ", flipBookRef.current?.flipNext())
        flipBookRef.current?.flipNext();
      };
    
    const prevButtonClick = () => {
        flipBookRef.current?.flipPrev();
      };

    const onPage = (e : {data:number}) => {
        
        console.log("props: ", flipBookRef.current)
        setPages(e.data)

    }

    useEffect(() => {
        if (flipBookRef.current) {
            console.log(flipBookRef)
            setTotalPages(flipBookRef.current.getPageCount());
        }
    }, []);
    

    return(
        <>
        <div>
        <HTMLFlipBook 
        ref={(el) => {  flipBookRef = el; }}
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
            <Page number={1}>Page text</Page>
            <Page number={2}>Page text</Page>
            <Page number={3}>Page text</Page>
            <Page number={4}>Page text</Page>
            <PageCover>THE END</PageCover>
        </HTMLFlipBook>
        <div className="container">
            <div>

              <button type="button"  onClick={prevButtonClick}>
                Previous page
              </button>

              [<span>{pages + 1}</span> of
               <span>{totalPages}</span>]

              <button type="button" onClick={nextButtonClick}>
                Next page
              </button>

            </div>

          </div>

        </div>
        </>
    )
}

export default PictureBook