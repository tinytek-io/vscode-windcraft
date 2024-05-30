import { JsxAST } from "../JsxAST";

export const buttonJsxAST: JsxAST.Component = {
  type: "component",
  name: "Button",
  isExported: true,
  position: {
    start: 0,
    end: 100,
  },
  props: {
    onClick: {
      value: "() => void",
      position: {
        start: 0,
        end: 100,
      },
    },
    children: {
      value: "React.ReactNode",
      position: {
        start: 0,
        end: 100,
      },
    },
  },
  return: [
    {
      type: "element",
      name: "button",
      position: {
        start: 0,
        end: 100,
      },
      props: {
        className: {
          value: "flex",
          position: {
            start: 0,
            end: 100,
          },
        },
        onClick: {
          value: "onClick",
          position: {
            start: 0,
            end: 100,
          },
        },
      },
      children: [
        {
          type: "element",
          name: "div",
          position: {
            start: 0,
            end: 100,
          },
          props: {
            className: {
              value: "flex flex-col",
              position: {
                start: 0,
                end: 100,
              },
            },
          },
          children: [
            {
              type: "text",
              value: "test",
              position: {
                start: 0,
                end: 100,
              },
            },
          ],
        },
        {
          type: "element",
          name: "img",
          position: {
            start: 0,
            end: 100,
          },
          props: {
            src: {
              value: "test",
              position: {
                start: 0,
                end: 100,
              },
            },
            className: {
              value: "w-full",
              position: {
                start: 0,
                end: 100,
              },
            },
          },
        },
        {
          type: "expression",
          expression: "children",
          position: {
            start: 0,
            end: 100,
          },
        },
      ],
    },
  ],
};
