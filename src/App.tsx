import { useEffect, useState } from 'react';
import { InfoItem } from './components/InfoItem';
import { Button } from './components/Button';
import * as C from './App.styles';
import logoImage from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';
import { GridItemType } from './types/GridItemType';
import { items } from './data/items';
import { GridItem } from './components/GridItem';
import { formatTimer } from './utils/format_time';

export default function App() {
    const [playing, setPlaying] = useState<boolean>(false);
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [moveCount, setMoveCount] = useState<number>(0);
    const [shownCount, setshownCount] = useState<number>(0);
    const [gridItems, setGridItems] = useState<GridItemType[]>([]);

    useEffect(() => resetGame(), []);

    useEffect(() => {
        const timer = setInterval(() => {
            if (playing) {
                setTimeElapsed(timeElapsed + 1);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [playing, timeElapsed]);

    //Verificar se os abertos sãi iguais
    useEffect(() => {
        if (shownCount === 2) {
            let opened = gridItems.filter((items) => items.shown === true);
            if (opened.length === 2) {
                // se eles são iguais, torna-los permanente
                if (opened[0].item == opened[1].item) {
                    let tmpGrid = [...gridItems];

                    for (let i in tmpGrid) {
                        if (tmpGrid[i].shown) {
                            tmpGrid[i].permanentShown = true;
                            tmpGrid[i].shown = false;
                        }
                    }
                    setGridItems(tmpGrid);
                    setshownCount(0);
                } else {
                    //se não são iguais fecha eles
                    let tmpGrid = [...gridItems];

                    setTimeout(() => {
                        for (const i in tmpGrid) {
                            tmpGrid[i].shown = false;
                        }
                    }, 1000);
                    setGridItems(tmpGrid);
                    setshownCount(0);
                }

                setMoveCount((moveCount) => moveCount + 1);
            }
        }
    }, [shownCount, gridItems]);

    useEffect(() => {
        if (moveCount > 0 && gridItems.every((item) => item.permanentShown == true)) {
            setPlaying(false)
        }

    },[moveCount, gridItems]);

    const resetGame = () => {
        // 1 - Resetar o jogo
        setTimeElapsed(0);
        setMoveCount(0);
        setshownCount(0);
        // 2 - Criar o grid
        // 2.1 - criar o grid vazio
        let tmpGrid: GridItemType[] = [];
        for (let i = 0; i < items.length * 2; i++) {
            tmpGrid.push({
                item: null,
                shown: false,
                permanentShown: false,
            });
        }
        //2.2 - preenche o grid
        for (let w = 0; w < 2; w++) {
            for (let h = 0; h < items.length; h++) {
                let pos = -1;
                while (pos < 0 || tmpGrid[pos].item != null) {
                    pos = Math.floor(Math.random() * (items.length * 2));
                }
                tmpGrid[pos].item = h;
            }
        }
        //2.3 - jogar no state
        setGridItems(tmpGrid);

        //3 - começar o jogo
        setPlaying(true);
    };

    const handleItemClick = (index: number) => {
        if (playing && index != null && shownCount < 2) {
            let tmpGrid = [...gridItems];
            if (
                tmpGrid[index].permanentShown === false &&
                tmpGrid[index].shown === false
            ) {
                tmpGrid[index].shown = true;
                setshownCount(shownCount + 1);
            }

            setGridItems(tmpGrid);
        }
    };
    return (
        <C.Container>
            <C.Info>
                <C.LogoLink href="">
                    <img src={logoImage} alt="logo" width="200" />
                </C.LogoLink>
                <C.InfoArea>
                    <InfoItem label="Tempo" value={formatTimer(timeElapsed)} />
                    <InfoItem label="Movimentos" value={moveCount.toString()} />
                </C.InfoArea>

                <Button
                    label="Reiniciar"
                    icon={RestartIcon}
                    onClick={resetGame}
                />
            </C.Info>
            <C.GridArea>
                <C.Grid>
                    {gridItems.map((item, index) => (
                        <GridItem
                            key={index}
                            item={item}
                            onClick={() => handleItemClick(index)}
                        />
                    ))}
                </C.Grid>
            </C.GridArea>
        </C.Container>
    );
}
