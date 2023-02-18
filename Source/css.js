import cjson from './Resource/css.json' assert {type: 'json'};

function compileCSS(attributes, e) {
    attributes.split(' ').forEach((attr) => {
        var attr = attr.split('-')
        if (attr[0] in cjson.properties) {
            var source = cjson.properties[attr[0]]
            if (attr.length > 2) {
                if (attr[2]) {
                    try {
                        attr[1] = attr[1].replaceAll('.', '-')
                        attr[2] = attr[2].replaceAll('.', '-').replaceAll(',', ' ')
                        try {
                            attr[3] = attr[3].replaceAll('.', '-')
                        }catch{}

                        try {
                            attr[2] = eval(attr[2].replace('${', '').replace('}', ''))
                            e.style.cssText += `${source.for}: ${attr[1]}`
                        } catch {
                            e.style.cssText += `${source.for}: ${attr[1]}`
                        }

                        if (attr[1] in source.default) {
                            e.style.cssText += `${source.for}-${attr[1]}: ${attr[2]}`
                        }
                        
                        else if (attr[1] in source.sub) {
                            e.style.cssText += `${attr[1]}-${attr[2]}: ${attr[3]}`
                        }
                        
                        else if (attr[1] in source.separate) {
                            e.style.cssText += `${attr[1]}: ${attr[2]}`
                        }
                        
                        else if (attr[1] == "all") {
                            e.style.cssText += `${source.for}: ${attr[2]}`
                        }

                        else {
                            console.error("CSS sub property not included in css.json. Go to ./Resource/css.json and change sub properties or recheck property.")
                        }
                    } catch (err) {
                        console.log(err)
                    }
                } else {
                    console.error("No value given for CSS property. Please add value or check properties in./Resource/css.json.")
                }
            } else {
                if (attr[1]) {
                    try {attr[1] = attr[1].replaceAll('.', '-')} catch {}
                    try {attr[1] = attr[1].replaceAll(',', ' ')} catch {}
                    try {attr[2] = attr[2].replaceAll('.', '-')} catch {}
                    try {
                        attr[1] = eval(attr[1].replace('${', '').replace('}', ''))
                        e.style.cssText += `${source.for}: ${attr[1]}`
                    } catch {
                        e.style.cssText += `${source.for}: ${attr[1]}`
                    }
                } else {
                    console.error("No value given for CSS property. Please add value or check properties in./Resource/css.json.")
                }
            }

        }
        
        else if (attr[0] in cjson.states) {
            handleStates(e, attr)
        }

        else if (attr[0] in cjson.presets) {
            var source = cjson.presets[attr[0]][attr[1]][attr[2]]
            e.style.cssText += source.css
        }
        
        else {
            console.error("CSS property not included in css.json. Go to ./Resource/css.json and change properties or recheck property.")
        }
    })
}

document.querySelectorAll('[cjs]').forEach((e) => {
    var attributes = e.attributes.getNamedItem('cjs').value;
    compileCSS(attributes, e)
})

function handleStates(e, attr) {
    let initState;
    e.attributes.getNamedItem('cjs').value.split(' ').forEach((el) => {
        if (el.startsWith(attr[1])) {
            initState = el;
        }
    })
    
    if (attr[0] == '&hover') {
        e.onmouseover = function () {
            compileCSS(attr.toString().replace(`${attr[0]},`, '').replaceAll(',', '-'), e)
        }

        e.onmouseout = function () {
            compileCSS(initState, e)
        }
    }

    else if (attr[0] == '&click') {
        e.onclick = function () {
            if (e.getAttribute("clicked")) {
                compileCSS(initState, e)
                e.removeAttribute("clicked")
            } else {
                compileCSS(attr.toString().replace(`${attr[0]},`, '').replaceAll(',', '-'), e)
                e.setAttribute("clicked", true)
            }

            window.addEventListener('click', (el) => {
                if (el.target != e) {
                    compileCSS(initState, e)
                }
            })
        }

    }
}
