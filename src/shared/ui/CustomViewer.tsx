"use client";
import React from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "./markdown.css";

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

type CustomViewerProps = {
  initialValue: string;
};

const CustomViewer = ({ initialValue }: CustomViewerProps) => {
  return (
    <div className="w-full h-full" data-color-mode="light">
      <MarkdownPreview
        source={initialValue}
        style={{
          backgroundColor: "transparent",
          width: "100%",
        }}
        wrapperElement={{
          "data-color-mode": "light",
        }}
      />
    </div>
  );
};

export default CustomViewer;
