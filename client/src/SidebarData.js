// import React from 'react';

let SidebarData = [
    {
        title: "Group",
        link: "/Group",
    },
    {
        title: "Friends",
        link: "/Friends",
    },
    {
        title: "Family",
        link: "/Family",
    }
];



export function getSData(){
    return SidebarData;
}

export function addData(titlename){
    let x = {title: titlename, link: "/" + titlename};

    SidebarData.push(x);
}