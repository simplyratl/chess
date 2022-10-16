import {DragPreviewImage, useDrag} from "react-dnd";
import {PieceProps} from "../../utils/gameTypes";

interface Props {
	piece: PieceProps;
	position: string;
}

const Piece = ({piece, position}: Props) => {
	const image = require(`../../assets/figures/${piece.color}${piece.type}.png`);

	const [{isDragging}, drag, preview] = useDrag({
		type: "piece",
		item: {id: `${position}_${piece.color}${piece.type}`},
		collect: (monitor: any) => {
			return {isDragging: !!monitor.isDragging()};
		},
	});

	return (
		<>
			<DragPreviewImage connect={preview} src={image}/>
			<div
				ref={drag}
				style={{
					opacity: isDragging ? (window.innerWidth <= 768 ? 0.4 : 0) : 1,
					cursor: isDragging ? "grabbing !important" : "grab",
				}}
			>
				<img src={image} alt={`${piece.color}${piece.type}`}/>
			</div>
		</>
	);
};

export default Piece;
