"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";

const State_Provider = ({ children }: any) => {
  return <Provider store={store}>{children}</Provider>;
};

export default State_Provider;
