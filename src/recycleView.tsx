import { useEffect, useRef, useState } from "react";

type RecycleViewType<T> = {
    list: T[];
    scrollHeight: number;
    itemHeight: number;
    renderNode: (item: T, index: number) => React.ReactNode;
};

export const RecycleView = <T extends Record<string, any>>(
    props: RecycleViewType<T>
) => {
    const sRef = useRef<HTMLDivElement | null>(null);
    const [virtualList, setVirtualList] = useState<any[]>([]);

    const [topHeight, setTopHeight] = useState<number>(0);
    const [endHeight, setEndHeight] = useState<number>(props.scrollHeight);

    const preRadio = useRef<number>(1); //预渲染前后屏百分比,默认上下预渲染一屏幕，屏幕较大内容较多可以半屏
    const startIndex = useRef<number>(0);
    const totalLength = useRef<number>(0);

    useEffect(() => {
        //保存一下lenght，避免来回计算了
        totalLength.current = props.list.length;
        onUpdateVirtual(true);
    }, [props]);

    const onUpdateVirtual = (isForceUpdate = false) => {
        const height = props.scrollHeight;
        const itemHeight = props.itemHeight;
        const scrollTop = sRef.current!.scrollTop;

        let currentIndex = Math.floor(scrollTop / itemHeight);
        if (!isForceUpdate && currentIndex === startIndex.current) return;
        startIndex.current = currentIndex;

        const radio = preRadio.current;
        let start = Math.floor((scrollTop - height * radio) / itemHeight);
        if (start < 0) {
            start = 0;
        }
        const tLength = totalLength.current;
        let end = Math.ceil((scrollTop + height + height * radio) / itemHeight);
        if (end > tLength) {
            end = tLength - 1;
        }
        const list = props.list;
        const newVirtualList: any[] = [];
        for (let idx = start; idx <= end; idx++) {
            newVirtualList.push(list[idx]);
        }
        setTopHeight(start * itemHeight);
        setVirtualList(newVirtualList);
        setEndHeight(tLength * itemHeight - (end + 1) * itemHeight);
    };

    return (
        <div
            id="scroll-view"
            style={{
                overflowY: "auto",
                width: "auto",
                height: props.scrollHeight,
            }}
            ref={sRef}
            onScroll={() => onUpdateVirtual()}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "auto",
                    transform: `translateY(${topHeight}px)`,
                }}
            >
                {virtualList.map((item, index) => (
                    <div key={index} style={{ height: props.itemHeight }}>
                        {props.renderNode(item, index)}
                    </div>
                ))}

                {/* //不加上滚动条会显示有问题，甚至有些场景无法继续滚动 */}
                <div style={{ height: endHeight }} />
            </div>
        </div>
    );
};
