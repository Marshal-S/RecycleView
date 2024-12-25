import { useEffect, useState } from "react";
import { RecycleView } from "./recycleView";

function App() {
    const [record, setRecord] = useState<any[]>([]);

    useEffect(() => {
        const list = [];
        for (let idx = 1; idx <= 10000000; idx++) {
            list.push({
                name: "信息" + idx,
                margin: (idx % 10) * 10,
            });
        }
        setRecord(list);
    }, []);

    return (
        <RecycleView
            list={record}
            scrollHeight={900}
            itemHeight={50}
            renderNode={(item) => (
                <div
                    style={{
                        height: 50,
                        display: "block",
                        placeContent: "center",
                    }}
                >
                    <div className="item-view">内容：{item.name}</div>
                </div>
            )}
        />
    );
}

export default App;
