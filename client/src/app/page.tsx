"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { increment, decrement } from "../store/slices/counterSlice";

export default function Counter() {
    const count = useSelector((state: RootState) => state.counter.value);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex gap-4 items-center">
                <button className="btn" onClick={() => dispatch(decrement())}>
                    -
                </button>
                <span>{count}</span>
                <button className="btn" onClick={() => dispatch(increment())}>
                    +
                </button>
            </div>
        </div>
    );
}

// this comment is here to test git changes
